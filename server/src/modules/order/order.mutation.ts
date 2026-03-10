import { GraphQLError } from "graphql";
import { builder } from "../../builder";
import {
	ItemStatus,
	OrderStatus,
	PaymentStatus,
} from "../../generated/prisma/enums";
import { calculateRentalTotalByDays } from "../../utils/date";
import {
	CreateOrderInput,
	Order,
	OrderStatusType,
	PaymentStatusType,
	RecordOrderPaymentInput,
	UpdateOrderInput,
} from "./order.model";

function generateOrderCode() {
	const timestamp = Date.now().toString(36).toUpperCase();
	const random = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `ORD-${timestamp}-${random}`;
}

function validateOrderDateRange(rentalDate: Date, returnDate: Date) {
	if (returnDate < rentalDate) {
		throw new GraphQLError("Ngày trả phải sau hoặc bằng ngày thuê.");
	}
}

async function checkItemsAvailability(
	tx: Parameters<
		Parameters<typeof import("../../db").prisma.$transaction>[0]
	>[0],
	itemIds: string[],
	rentalDate: Date,
	returnDate: Date,
	excludeOrderId?: string,
) {
	const overlappingOrders = await tx.order.findMany({
		where: {
			id: excludeOrderId ? { not: excludeOrderId } : undefined,
			status: { notIn: [OrderStatus.CANCELLED, OrderStatus.RETURNED] },
			rentalDate: { lt: returnDate },
			returnDate: { gt: rentalDate },
			items: {
				some: {
					itemId: { in: itemIds },
				},
			},
		},
		include: {
			items: {
				include: {
					item: true,
				},
			},
		},
	});

	if (overlappingOrders.length > 0) {
		const occupiedItemIds = new Set(
			overlappingOrders.flatMap((o) => o.items.map((i) => i.itemId)),
		);
		const conflictingItemIds = itemIds.filter((id) => occupiedItemIds.has(id));

		const items = await tx.item.findMany({
			where: { id: { in: conflictingItemIds } },
		});

		const codes = items.map((i) => i.code).join(", ");
		throw new GraphQLError(
			`Sản phẩm [${codes}] đã có lịch thuê trùng với thời gian này.`,
		);
	}
}

async function updateItemsStatus(
	tx: Parameters<
		Parameters<typeof import("../../db").prisma.$transaction>[0]
	>[0],
	itemIds: string[],
	status: string,
) {
	if (status === OrderStatus.PICKED_UP) {
		await tx.item.updateMany({
			where: { id: { in: itemIds } },
			data: { status: ItemStatus.RENTED },
		});
	} else if (
		status === OrderStatus.RETURNED ||
		status === OrderStatus.CANCELLED
	) {
		await tx.item.updateMany({
			where: { id: { in: itemIds } },
			data: { status: ItemStatus.AVAILABLE },
		});
	}
}

function resolvePaymentStatus(balanceDue: number, depositPaid: number) {
	if (balanceDue <= 0) return PaymentStatus.PAID;
	if (depositPaid > 0) return PaymentStatus.DEPOSITED;
	return PaymentStatus.UNPAID;
}

builder.mutationFields((t) => ({
	createOrder: t.prismaField({
		type: Order,
		args: {
			input: t.arg({ type: CreateOrderInput, required: true }),
		},
		resolve: async (query, _root, { input }, ctx) => {
			return ctx.prisma.$transaction(async (tx) => {
				let customerId = input.customerId;

				if (!customerId && input.customer) {
					const existingCustomer = await tx.customer.findUnique({
						where: { phone: input.customer.phone },
					});

					if (existingCustomer) {
						customerId = existingCustomer.id;
					} else {
						const customer = await tx.customer.create({
							data: {
								name: input.customer.name,
								phone: input.customer.phone,
								address: input.customer.address ?? "",
								note: input.customer.note ?? "",
							},
						});
						customerId = customer.id;
					}
				} else if (!customerId) {
					throw new GraphQLError(
						"Vui lòng chọn hoặc nhập thông tin khách hàng.",
					);
				}

				const rentalDate = input.rentalDate;
				const returnDate = input.returnDate;
				validateOrderDateRange(rentalDate, returnDate);

				await checkItemsAvailability(
					tx,
					input.items.map((item) => item.itemId),
					rentalDate,
					returnDate,
				);

				const code = generateOrderCode();
				const totalAmount = calculateRentalTotalByDays(
					input.items,
					rentalDate,
					returnDate,
				);
				const balanceDue = totalAmount - input.depositPaid;
				const paymentStatus = resolvePaymentStatus(
					balanceDue,
					input.depositPaid,
				);

				return tx.order.create({
					...query,
					data: {
						code,
						customerId,
						rentalDate,
						returnDate,
						eventDate: input.eventDate ?? undefined,
						eventType: input.eventType,
						totalAmount,
						depositPaid: input.depositPaid,
						balanceDue,
						note: input.note ?? "",
						status: OrderStatus.PENDING,
						paymentStatus,
						items: {
							create: input.items.map((item) => ({
								itemId: item.itemId,
								rentalPrice: item.rentalPrice,
								deposit: item.deposit,
							})),
						},
					},
				});
			});
		},
	}),

	updateOrderStatus: t.prismaField({
		type: Order,
		args: {
			id: t.arg.id({ required: true }),
			status: t.arg({ type: OrderStatusType, required: true }),
		},
		resolve: async (query, _root, { id, status }, ctx) => {
			return ctx.prisma.$transaction(async (tx) => {
				const order = await tx.order.findUnique({
					where: { id: id as string },
					include: { items: true },
				});

				if (!order) throw new GraphQLError("Không tìm thấy đơn hàng.");
				if (
					status === OrderStatus.CANCELLED &&
					order.status === OrderStatus.RETURNED &&
					order.paymentStatus === PaymentStatus.PAID
				) {
					throw new GraphQLError(
						"Đơn đã hoàn thành (đã trả hàng và thanh toán), không thể hủy.",
					);
				}

				await updateItemsStatus(
					tx,
					order.items.map((i) => i.itemId),
					status,
				);

				return tx.order.update({
					...query,
					where: { id: id as string },
					data: {
						status,
						returnedAt:
							status === OrderStatus.RETURNED
								? new Date()
								: order.status === OrderStatus.RETURNED
									? null
									: undefined,
					},
				});
			});
		},
	}),

	updatePaymentStatus: t.prismaField({
		type: Order,
		args: {
			id: t.arg.id({ required: true }),
			status: t.arg({ type: PaymentStatusType, required: true }),
		},
		resolve: async (query, _root, { id, status }, ctx) => {
			const order = await ctx.prisma.order.findUnique({
				where: { id: id as string },
				select: {
					id: true,
					status: true,
					balanceDue: true,
					paymentStatus: true,
				},
			});

			if (!order) {
				throw new GraphQLError("Không tìm thấy đơn hàng.");
			}

			if (order.status === OrderStatus.CANCELLED) {
				throw new GraphQLError("Không thể cập nhật thanh toán cho đơn đã hủy.");
			}

			if (status !== PaymentStatus.PAID) {
				throw new GraphQLError(
					"Không cho phép cập nhật trạng thái thanh toán thủ công.",
				);
			}

			if (order.balanceDue > 0) {
				throw new GraphQLError(
					"Đơn hàng vẫn còn công nợ, không thể xác nhận đã thanh toán.",
				);
			}

			if (order.paymentStatus === PaymentStatus.PAID) {
				return ctx.prisma.order.findUniqueOrThrow({
					...query,
					where: { id: id as string },
				});
			}

			return ctx.prisma.order.update({
				...query,
				where: { id: id as string },
				data: { paymentStatus: status },
			});
		},
	}),

	updateOrder: t.prismaField({
		type: Order,
		args: {
			id: t.arg.id({ required: true }),
			input: t.arg({ type: UpdateOrderInput, required: true }),
		},
		resolve: async (query, _root, { id, input }, ctx) => {
			return ctx.prisma.$transaction(async (tx) => {
				const existing = await tx.order.findUnique({
					where: { id: id as string },
				});

				if (!existing) throw new GraphQLError("Không tìm thấy đơn hàng.");
				if (
					input.status === OrderStatus.CANCELLED &&
					existing.status === OrderStatus.RETURNED &&
					existing.paymentStatus === PaymentStatus.PAID
				) {
					throw new GraphQLError(
						"Đơn đã hoàn thành (đã trả hàng và thanh toán), không thể hủy.",
					);
				}

				const rentalDate = input.rentalDate ?? existing.rentalDate;
				const returnDate = input.returnDate ?? existing.returnDate;
				validateOrderDateRange(rentalDate, returnDate);
				const depositPaid = input.depositPaid ?? existing.depositPaid;
				const lateFee = input.lateFee ?? existing.lateFee ?? 0;
				const damageFee = input.damageFee ?? existing.damageFee ?? 0;

				const orderItems = await tx.orderItem.findMany({
					where: { orderId: id as string },
				});
				const totalAmount = calculateRentalTotalByDays(
					orderItems,
					rentalDate,
					returnDate,
				);
				const balanceDue = totalAmount + lateFee + damageFee - depositPaid;
				const paymentStatus = resolvePaymentStatus(balanceDue, depositPaid);

				if (input.rentalDate || input.returnDate) {
					await checkItemsAvailability(
						tx,
						orderItems.map((i) => i.itemId),
						rentalDate,
						returnDate,
						id as string,
					);
				}

				if (input.status && input.status !== existing.status) {
					await updateItemsStatus(
						tx,
						orderItems.map((i) => i.itemId),
						input.status,
					);
				}

				// Build typed update data
				let returnedAt: Date | null | undefined;
				if (
					input.status === OrderStatus.RETURNED &&
					existing.status !== OrderStatus.RETURNED
				) {
					returnedAt = new Date();
				} else if (
					input.status &&
					input.status !== OrderStatus.RETURNED &&
					existing.status === OrderStatus.RETURNED
				) {
					returnedAt = null;
				}

				return tx.order.update({
					...query,
					where: { id: id as string },
					data: {
						rentalDate: input.rentalDate ? rentalDate : undefined,
						returnDate: input.returnDate ? returnDate : undefined,
						returnedAt,
						eventDate:
							input.eventDate !== undefined ? input.eventDate : undefined,
						eventType: input.eventType ?? undefined,
						depositPaid: input.depositPaid ?? undefined,
						lateFee: input.lateFee ?? undefined,
						damageFee: input.damageFee ?? undefined,
						note: input.note ?? undefined,
						status: input.status ?? undefined,
						totalAmount,
						balanceDue,
						paymentStatus,
					},
				});
			});
		},
	}),

	deleteOrder: t.prismaField({
		type: Order,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return ctx.prisma.$transaction(async (tx) => {
				const order = await tx.order.findUnique({
					where: { id: id as string },
					include: { items: true },
				});

				if (!order) throw new GraphQLError("Không tìm thấy đơn hàng.");

				// Free up items first
				await tx.item.updateMany({
					where: { id: { in: order.items.map((i) => i.itemId) } },
					data: { status: ItemStatus.AVAILABLE },
				});

				return tx.order.delete({
					...query,
					where: { id: id as string },
				});
			});
		},
	}),

	updateOrderItem: t.prismaField({
		type: Order,
		args: {
			id: t.arg.id({ required: true }),
			damageNote: t.arg.string({ required: true }),
		},
		resolve: async (query, _root, { id, damageNote }, ctx) => {
			const orderItem = await ctx.prisma.orderItem.update({
				where: { id: id as string },
				data: { damageNote },
				include: { order: true },
			});

			return ctx.prisma.order.findUniqueOrThrow({
				...query,
				where: { id: orderItem.orderId },
			});
		},
	}),
	recordOrderPayment: t.prismaField({
		type: Order,
		args: {
			input: t.arg({ type: RecordOrderPaymentInput, required: true }),
		},
		resolve: async (query, _root, { input }, ctx) => {
			if (input.amount === 0) {
				throw new GraphQLError("Số tiền thanh toán không được bằng 0.");
			}
			if (!input.note || input.note.trim().length < 10) {
				throw new GraphQLError(
					"Vui lòng nhập ghi chú đầy đủ (ít nhất 10 ký tự).",
				);
			}

			return ctx.prisma.$transaction(async (tx) => {
				const order = await tx.order.findUnique({
					where: { id: input.orderId },
				});

				if (!order) throw new GraphQLError("Không tìm thấy đơn hàng.");

				if (order.status === OrderStatus.CANCELLED) {
					throw new GraphQLError(
						"Không thể ghi nhận thanh toán cho đơn đã hủy.",
					);
				}

				const totalRequired =
					order.totalAmount + (order.lateFee ?? 0) + (order.damageFee ?? 0);
				const currentBalance = totalRequired - order.depositPaid;
				const currentDue = Math.max(currentBalance, 0);
				const refundableAmount = Math.max(-currentBalance, 0);

				if (currentDue <= 0 && refundableAmount <= 0) {
					throw new GraphQLError("Đơn hàng này đã tất toán.");
				}

				if (input.amount > 0 && currentDue <= 0) {
					throw new GraphQLError("Đơn hàng này không còn công nợ để thu thêm.");
				}

				if (input.amount < 0 && refundableAmount <= 0) {
					throw new GraphQLError("Đơn hàng này không có khoản cọc dư để hoàn.");
				}

				if (input.amount > currentDue) {
					throw new GraphQLError("Số tiền thu vượt quá công nợ hiện tại.");
				}

				if (Math.abs(input.amount) > refundableAmount && input.amount < 0) {
					throw new GraphQLError(
						"Số tiền hoàn vượt quá khoản cọc dư hiện tại.",
					);
				}

				const nextDepositPaid = order.depositPaid + input.amount;
				const nextBalanceDue = totalRequired - nextDepositPaid;
				const nextPaymentStatus = resolvePaymentStatus(
					nextBalanceDue,
					nextDepositPaid,
				);

				await tx.payment.create({
					data: {
						orderId: input.orderId,
						amount: input.amount,
						method: input.method,
						note: (input.note ?? "").trim(),
						paidAt: input.paidAt ?? new Date(),
					},
				});

				await tx.order.update({
					where: { id: input.orderId },
					data: {
						depositPaid: nextDepositPaid,
						balanceDue: nextBalanceDue,
						paymentStatus: nextPaymentStatus,
					},
				});

				return tx.order.findUniqueOrThrow({
					...query,
					where: { id: input.orderId },
				});
			});
		},
	}),
}));
