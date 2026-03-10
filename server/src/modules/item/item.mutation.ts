import { builder } from "../../builder";
import { ItemStatus } from "../../generated/prisma/enums";
import { CreateItemInput, Item, UpdateItemInput } from "./item.model";

builder.mutationFields((t) => ({
	createItem: t.prismaField({
		type: Item,
		args: {
			input: t.arg({
				type: CreateItemInput,
				required: true,
			}),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.item.create({
				...query,
				data: {
					code: args.input.code,
					variantId: args.input.variantId,
					status: args.input.status || ItemStatus.AVAILABLE,
					note: args.input.note || "",
				},
			});
		},
	}),
	updateItem: t.prismaField({
		type: Item,
		args: {
			id: t.arg.id({ required: true }),
			input: t.arg({
				type: UpdateItemInput,
				required: true,
			}),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.item.update({
				...query,
				where: {
					id: args.id,
				},
				data: {
					code: args.input.code ?? undefined,
					variantId: args.input.variantId ?? undefined,
					status: args.input.status ?? undefined,
					note: args.input.note ?? undefined,
				},
			});
		},
	}),
	deleteItem: t.prismaField({
		type: Item,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.item.delete({
				...query,
				where: {
					id: args.id,
				},
			});
		},
	}),
}));
