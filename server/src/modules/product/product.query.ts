import { builder } from "../../builder";
import { Product, ProductVariant } from "./product.model";

builder.queryFields((t) => ({
	products: t.prismaField({
		type: [Product],
		args: {
			categoryId: t.arg.string(),
		},
		resolve: async (query, _root, { categoryId }, ctx) => {
			return ctx.prisma.product.findMany({
				...query,
				where: {
					categoryId: categoryId || undefined,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
	}),
	product: t.prismaField({
		type: Product,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return ctx.prisma.product.findUniqueOrThrow({
				...query,
				where: { id: String(id) },
			});
		},
	}),
	productVariants: t.prismaField({
		type: [ProductVariant],
		args: {
			productId: t.arg.string(),
		},
		resolve: async (query, _root, { productId }, ctx) => {
			return ctx.prisma.productVariant.findMany({
				...query,
				where: {
					productId: productId || undefined,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
	}),
	productVariant: t.prismaField({
		type: ProductVariant,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return ctx.prisma.productVariant.findUniqueOrThrow({
				...query,
				where: { id: String(id) },
			});
		},
	}),
}));
