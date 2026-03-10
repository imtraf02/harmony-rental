import { builder } from "../../builder";
import {
	CreateCustomerInput,
	Customer,
	UpdateCustomerInput,
} from "./customer.model";

builder.mutationFields((t) => ({
	createCustomer: t.prismaField({
		type: Customer,
		args: {
			input: t.arg({ type: CreateCustomerInput, required: true }),
		},
		resolve: async (query, _root, { input }, ctx) => {
			return ctx.prisma.customer.create({
				...query,
				data: {
					name: input.name,
					phone: input.phone,
					address: input.address ?? "",
					note: input.note ?? "",
				},
			});
		},
	}),

	updateCustomer: t.prismaField({
		type: Customer,
		args: {
			id: t.arg.id({ required: true }),
			input: t.arg({ type: UpdateCustomerInput, required: true }),
		},
		resolve: async (query, _root, { id, input }, ctx) => {
			return ctx.prisma.customer.update({
				...query,
				where: { id: String(id) },
				data: {
					name: input.name ?? undefined,
					phone: input.phone ?? undefined,
					address: input.address ?? undefined,
					note: input.note ?? undefined,
				},
			});
		},
	}),

	deleteCustomer: t.prismaField({
		type: Customer,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return ctx.prisma.customer.delete({
				...query,
				where: { id: String(id) },
			});
		},
	}),
}));
