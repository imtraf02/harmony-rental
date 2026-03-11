import { GraphQLError } from "graphql";
import { builder } from "../../builder";
import { OrderStatus, PaymentStatus } from "../../generated/prisma/enums";
import type {
	OrderWhereInput,
	PaymentWhereInput,
} from "../../generated/prisma/models";
import { addDays, endOfDay, formatDateKey, startOfDay } from "../../utils/date";
import {
	DashboardAnalytics,
	DashboardDueOrder,
	DashboardTimePresetType,
	Order,
	OrderStatusType,
	Payment,
	PaymentStatusType,
} from "./order.model";

function resolveRange(args: {
	preset: "THIS_MONTH" | "LAST_30_DAYS" | "CUSTOM";
	startDate?: Date | null;
	endDate?: Date | null;
}) {
	const now = new Date();

	if (args.preset === "CUSTOM") {
		if (!args.startDate || !args.endDate) {
			throw new GraphQLError("Thiếu ngày bắt đầu hoặc ngày kết thúc.");
		}
		if (args.startDate > args.endDate) {
			throw new GraphQLError(
				"Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.",
			);
		}
		return {
			rangeStart: startOfDay(args.startDate),
			rangeEnd: endOfDay(args.endDate),
		};
	}

	if (args.preset === "LAST_30_DAYS") {
		return {
			rangeStart: startOfDay(addDays(now, -29)),
			rangeEnd: endOfDay(now),
		};
	}

	return {
		rangeStart: new Date(now.getFullYear(), now.getMonth(), 1),
		rangeEnd: endOfDay(now),
	};
}

function buildOrderWhere(args: {
	statuses?: OrderStatus[] | null;
	paymentStatuses?: PaymentStatus[] | null;
	search?: string | null;
}): OrderWhereInput {
	const where: OrderWhereInput = {};

	if (args.statuses && args.statuses.length > 0) {
		where.status = {
			in: args.statuses,
		};
	}

	if (args.paymentStatuses && args.paymentStatuses.length > 0) {
		where.paymentStatus = {
			in: args.paymentStatuses,
		};
	}

	if (args.search) {
		const search = args.search.trim();
		where.OR = [
			{ code: { contains: search, mode: "insensitive" } },
			{ customer: { name: { contains: search, mode: "insensitive" } } },
			{ customer: { phone: { contains: search, mode: "insensitive" } } },
		];
	}

	return where;
}

function buildPaymentWhere(args: {
	search?: string | null;
	startDate?: Date | null;
	endDate?: Date | null;
}) {
	const where: PaymentWhereInput = {};

	if (args.search) {
		const search = args.search.trim();
		where.OR = [
			{ method: { contains: search, mode: "insensitive" } },
			{ note: { contains: search, mode: "insensitive" } },
			{ order: { code: { contains: search, mode: "insensitive" } } },
			{
				order: {
					customer: { name: { contains: search, mode: "insensitive" } },
				},
			},
			{
				order: {
					customer: { phone: { contains: search, mode: "insensitive" } },
				},
			},
		];
	}

	if (args.startDate || args.endDate) {
		where.paidAt = {
			gte: args.startDate ?? undefined,
			lte: args.endDate ?? undefined,
		};
	}

	return where;
}

builder.queryFields((t) => ({
	orders: t.prismaField({
		type: [Order],
		args: {
			statuses: t.arg({ type: [OrderStatusType] }),
			paymentStatuses: t.arg({ type: [PaymentStatusType] }),
			search: t.arg.string(),
			page: t.arg.int({ defaultValue: 1 }),
			pageSize: t.arg.int({ defaultValue: 10 }),
		},
		resolve: async (query, _root, args, ctx) => {
			const where = buildOrderWhere(args);
			const page = args.page ?? 1;
			const pageSize = args.pageSize ?? 10;

			return ctx.prisma.order.findMany({
				...query,
				where,
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			});
		},
	}),
	ordersByProduct: t.prismaField({
		type: [Order],
		args: {
			productId: t.arg.string({ required: true }),
			page: t.arg.int({ defaultValue: 1 }),
			pageSize: t.arg.int({ defaultValue: 10 }),
		},
		resolve: async (query, _root, args, ctx) => {
			const page = args.page ?? 1;
			const pageSize = args.pageSize ?? 10;

			return ctx.prisma.order.findMany({
				...query,
				where: {
					items: {
						some: {
							item: {
								variant: {
									productId: args.productId,
								},
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			});
		},
	}),
	order: t.prismaField({
		type: Order,
		nullable: true,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.order.findUnique({
				...query,
				where: { id: args.id },
			});
		},
	}),
	ordersCount: t.int({
		args: {
			statuses: t.arg({ type: [OrderStatusType] }),
			paymentStatuses: t.arg({ type: [PaymentStatusType] }),
			search: t.arg.string(),
		},
		resolve: async (_root, args, ctx) => {
			const where = buildOrderWhere(args);
			return ctx.prisma.order.count({ where });
		},
	}),
	ordersByProductCount: t.int({
		args: {
			productId: t.arg.string({ required: true }),
		},
		resolve: async (_root, args, ctx) => {
			return ctx.prisma.order.count({
				where: {
					items: {
						some: {
							item: {
								variant: {
									productId: args.productId,
								},
							},
						},
					},
				},
			});
		},
	}),
	dashboardAnalytics: t.field({
		type: DashboardAnalytics,
		args: {
			preset: t.arg({
				type: DashboardTimePresetType,
				defaultValue: "THIS_MONTH",
			}),
			startDate: t.arg({ type: "DateTime" }),
			endDate: t.arg({ type: "DateTime" }),
			upcomingDays: t.arg.int({ defaultValue: 7 }),
		},
		resolve: async (_root, args, ctx) => {
			const { rangeStart, rangeEnd } = resolveRange({
				preset: args.preset ?? "THIS_MONTH",
				startDate: args.startDate,
				endDate: args.endDate,
			});

			const cancelledFilter = { status: { not: OrderStatus.CANCELLED } };

			const [
				aggregateResult,
				activeCount,
				ordersForChart,
				depositData,
				outstandingData,
				upcomingOrders,
				overdueOrders,
			] = await Promise.all([
				// Aggregate totals directly in DB
				ctx.prisma.order.aggregate({
					where: {
						createdAt: { gte: rangeStart, lte: rangeEnd },
						...cancelledFilter,
					},
					_count: { id: true },
					_sum: { totalAmount: true },
				}),
				// Active orders count
				ctx.prisma.order.count({
					where: {
						createdAt: { gte: rangeStart, lte: rangeEnd },
						status: {
							in: [
								OrderStatus.PENDING,
								OrderStatus.CONFIRMED,
								OrderStatus.PICKED_UP,
							],
						},
					},
				}),
				// Orders for chart (only the fields we need)
				ctx.prisma.order.findMany({
					where: {
						createdAt: { gte: rangeStart, lte: rangeEnd },
						...cancelledFilter,
					},
					select: {
						createdAt: true,
						totalAmount: true,
					},
					orderBy: { createdAt: "asc" },
				}),
				// Deposit collected (non-returned, non-cancelled)
				ctx.prisma.order.aggregate({
					where: {
						createdAt: { gte: rangeStart, lte: rangeEnd },
						status: {
							notIn: [OrderStatus.CANCELLED, OrderStatus.RETURNED],
						},
					},
					_sum: { depositPaid: true },
				}),
				// Outstanding balance
				ctx.prisma.order.aggregate({
					where: {
						createdAt: { gte: rangeStart, lte: rangeEnd },
						paymentStatus: { not: PaymentStatus.PAID },
						...cancelledFilter,
					},
					_sum: { balanceDue: true },
				}),
				// Upcoming returns
				ctx.prisma.order.findMany({
					where: {
						status: {
							notIn: [OrderStatus.RETURNED, OrderStatus.CANCELLED],
						},
						returnDate: {
							gte: new Date(),
							lte: endOfDay(addDays(new Date(), args.upcomingDays ?? 7)),
						},
					},
					select: {
						id: true,
						code: true,
						rentalDate: true,
						returnDate: true,
						totalAmount: true,
						balanceDue: true,
						status: true,
						customer: {
							select: { name: true, phone: true },
						},
					},
					orderBy: { returnDate: "asc" },
					take: 10,
				}),
				// Overdue returns
				ctx.prisma.order.findMany({
					where: {
						status: {
							notIn: [OrderStatus.RETURNED, OrderStatus.CANCELLED],
						},
						returnDate: { lt: new Date() },
					},
					select: {
						id: true,
						code: true,
						rentalDate: true,
						returnDate: true,
						totalAmount: true,
						balanceDue: true,
						status: true,
						customer: {
							select: { name: true, phone: true },
						},
					},
					orderBy: { returnDate: "asc" },
					take: 10,
				}),
			]);

			// Build chart from minimal data
			const chartMap = new Map<
				string,
				{ date: string; orders: number; revenue: number }
			>();
			for (const order of ordersForChart) {
				const dateKey = formatDateKey(order.createdAt);
				const point = chartMap.get(dateKey) ?? {
					date: dateKey,
					orders: 0,
					revenue: 0,
				};
				point.orders += 1;
				point.revenue += order.totalAmount;
				chartMap.set(dateKey, point);
			}

			const nowDay = startOfDay(new Date()).getTime();
			const MS_PER_DAY = 24 * 60 * 60 * 1000;
			const toDueOrder = (order: (typeof upcomingOrders)[number]) => ({
				id: order.id,
				code: order.code,
				customerName: order.customer.name,
				customerPhone: order.customer.phone,
				rentalDate: order.rentalDate,
				returnDate: order.returnDate,
				totalAmount: order.totalAmount,
				balanceDue: order.balanceDue,
				status: order.status,
				daysToDue: Math.ceil(
					(startOfDay(order.returnDate).getTime() - nowDay) / MS_PER_DAY,
				),
			});

			return {
				rangeStart,
				rangeEnd,
				totalOrders: aggregateResult._count.id,
				totalRevenue: aggregateResult._sum.totalAmount ?? 0,
				depositCollected: Math.max(depositData._sum.depositPaid ?? 0, 0),
				outstandingBalance: Math.max(outstandingData._sum.balanceDue ?? 0, 0),
				activeOrders: activeCount,
				chart: Array.from(chartMap.values()),
				upcomingReturns: upcomingOrders.map(toDueOrder),
				overdueReturns: overdueOrders.map(toDueOrder),
			};
		},
	}),
	paymentHistory: t.prismaField({
		type: [Payment],
		args: {
			search: t.arg.string(),
			startDate: t.arg({ type: "DateTime" }),
			endDate: t.arg({ type: "DateTime" }),
			page: t.arg.int({ defaultValue: 1 }),
			pageSize: t.arg.int({ defaultValue: 20 }),
		},
		resolve: async (query, _root, args, ctx) => {
			const page = args.page ?? 1;
			const pageSize = args.pageSize ?? 20;
			const where = buildPaymentWhere({
				search: args.search,
				startDate: args.startDate,
				endDate: args.endDate,
			});

			return ctx.prisma.payment.findMany({
				...query,
				where,
				orderBy: { paidAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			});
		},
	}),
	paymentHistoryCount: t.int({
		args: {
			search: t.arg.string(),
			startDate: t.arg({ type: "DateTime" }),
			endDate: t.arg({ type: "DateTime" }),
		},
		resolve: async (_root, args, ctx) => {
			const where = buildPaymentWhere({
				search: args.search,
				startDate: args.startDate,
				endDate: args.endDate,
			});
			return ctx.prisma.payment.count({ where });
		},
	}),
	upcomingReturns: t.field({
		type: [DashboardDueOrder],
		args: {
			days: t.arg.int({ defaultValue: 7 }),
		},
		resolve: async (_root, args, ctx) => {
			const upcomingDays = args.days ?? 7;
			const now = new Date();
			const nowDay = startOfDay(now).getTime();
			const MS_PER_DAY = 24 * 60 * 60 * 1000;

			const toDueOrder = (order: {
				id: string;
				code: string;
				customer: { name: string; phone: string };
				rentalDate: Date;
				returnDate: Date;
				totalAmount: number;
				balanceDue: number;
				status: OrderStatus;
			}) => ({
				id: order.id,
				code: order.code,
				customerName: order.customer.name,
				customerPhone: order.customer.phone,
				rentalDate: order.rentalDate,
				returnDate: order.returnDate,
				totalAmount: order.totalAmount,
				balanceDue: order.balanceDue,
				status: order.status,
				daysToDue: Math.ceil(
					(startOfDay(order.returnDate).getTime() - nowDay) / MS_PER_DAY,
				),
			});

			const [upcomingOrders, overdueOrders] = await Promise.all([
				ctx.prisma.order.findMany({
					where: {
						status: {
							notIn: [OrderStatus.RETURNED, OrderStatus.CANCELLED],
						},
						returnDate: {
							gte: now,
							lte: endOfDay(addDays(now, upcomingDays)),
						},
					},
					include: { customer: true },
					orderBy: { returnDate: "asc" },
				}),
				ctx.prisma.order.findMany({
					where: {
						status: {
							notIn: [OrderStatus.RETURNED, OrderStatus.CANCELLED],
						},
						returnDate: { lt: now },
					},
					include: { customer: true },
					orderBy: { returnDate: "asc" },
				}),
			]);

			return [
				...overdueOrders.map(toDueOrder),
				...upcomingOrders.map(toDueOrder),
			];
		},
	}),
}));
