import { builder } from "../../builder";
import { Customer } from "./customer.model";

builder.queryFields((t) => ({
	customers: t.prismaField({
		type: [Customer],
		resolve: async (query, _root, _args, ctx) => {
			return ctx.prisma.customer.findMany({
				...query,
				orderBy: { createdAt: "desc" },
			});
		},
	}),
	customer: t.prismaField({
		type: Customer,
		nullable: true,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.customer.findUnique({
				...query,
				where: { id: args.id },
			});
		},
	}),
}));
