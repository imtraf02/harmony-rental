import { builder } from "../../builder";
import { Category } from "./category.model";

builder.queryFields((t) => ({
	categories: t.prismaField({
		type: [Category],
		resolve: async (query, _root, _args, ctx) => {
			return ctx.prisma.category.findMany({
				...query,
				orderBy: { name: "asc" },
			});
		},
	}),
}));
