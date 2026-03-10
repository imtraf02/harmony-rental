import { z } from "zod";
import { builder } from "../../builder";
import { ItemStatus, OrderStatus } from "../../generated/prisma/enums";

export const ItemStatusType = builder.enumType("ItemStatus", {
	values: Object.values(ItemStatus),
});

type ItemFutureRentalShape = {
	orderId: string;
	orderCode: string;
	rentalDate: Date;
	returnDate: Date;
	customerName: string;
};

export const ItemFutureRental = builder
	.objectRef<ItemFutureRentalShape>("ItemFutureRental")
	.implement({
		fields: (t) => ({
			orderId: t.exposeID("orderId"),
			orderCode: t.exposeString("orderCode"),
			rentalDate: t.expose("rentalDate", { type: "DateTime" }),
			returnDate: t.expose("returnDate", { type: "DateTime" }),
			customerName: t.exposeString("customerName"),
		}),
	});

export const Item = builder.prismaObject("Item", {
	fields: (t) => ({
		id: t.exposeID("id"),
		code: t.exposeString("code"),
		variantId: t.exposeString("variantId"),
		variant: t.relation("variant"),
		status: t.expose("status", { type: ItemStatusType }),
		note: t.exposeString("note"),
		futureRentals: t.field({
			type: [ItemFutureRental],
			resolve: async (item, _args, ctx) => {
				const orders = await ctx.prisma.order.findMany({
					where: {
						status: {
							notIn: [OrderStatus.CANCELLED, OrderStatus.RETURNED],
						},
						returnDate: {
							gte: new Date(),
						},
						items: {
							some: {
								itemId: item.id,
							},
						},
					},
					select: {
						id: true,
						code: true,
						rentalDate: true,
						returnDate: true,
						customer: {
							select: {
								name: true,
							},
						},
					},
					orderBy: {
						rentalDate: "asc",
					},
				});

				return orders.map((order) => ({
					orderId: order.id,
					orderCode: order.code,
					rentalDate: order.rentalDate,
					returnDate: order.returnDate,
					customerName: order.customer.name,
				}));
			},
		}),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
});

export const CreateItemInput = builder.inputType("CreateItemInput", {
	fields: (t) => ({
		code: t.string({
			required: true,
			validate: z
				.string()
				.min(1, "Mã item không được để trống")
				.max(50, "Mã item tối đa 50 ký tự"),
		}),
		variantId: t.string({
			required: true,
			validate: z.uuid("ID biến thể không hợp lệ"),
		}),
		status: t.field({
			type: ItemStatusType,
			defaultValue: ItemStatus.AVAILABLE,
		}),
		note: t.string({
			validate: z.string().max(500, "Ghi chú tối đa 500 ký tự"),
		}),
	}),
});

export const UpdateItemInput = builder.inputType("UpdateItemInput", {
	fields: (t) => ({
		code: t.string({
			validate: z
				.string()
				.min(1, "Mã item không được để trống")
				.max(50, "Mã item tối đa 50 ký tự"),
		}),
		variantId: t.string({
			validate: z.uuid("ID biến thể không hợp lệ"),
		}),
		status: t.field({ type: ItemStatusType }),
		note: t.string({
			validate: z.string().max(500, "Ghi chú tối đa 500 ký tự"),
		}),
	}),
});
