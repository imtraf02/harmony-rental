import { builder } from "../../builder";
import { Item } from "./item.model";

builder.queryFields((t) => ({
	items: t.prismaField({
		type: [Item],
		args: {
			variantId: t.arg.string(),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.item.findMany({
				...query,
				where: {
					variantId: args.variantId || undefined,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
	}),
	item: t.prismaField({
		type: Item,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.item.findUniqueOrThrow({
				...query,
				where: {
					id: args.id,
				},
			});
		},
	}),
}));
