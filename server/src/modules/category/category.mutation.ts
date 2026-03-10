import { builder } from "../../builder";
import {
	Category,
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./category.model";

builder.mutationFields((t) => ({
	createCategory: t.prismaField({
		type: Category,
		args: {
			input: t.arg({
				type: CreateCategoryInput,
				required: true,
			}),
		},

		resolve: async (query, _root, args, ctx) => {
			return ctx.prisma.category.create({
				...query,
				data: {
					...args.input,
				},
			});
		},
	}),
	updateCategory: t.prismaField({
		type: Category,
		args: {
			id: t.arg({
				type: "ID",
				required: true,
			}),
			input: t.arg({
				type: UpdateCategoryInput,
				required: true,
			}),
		},

		resolve: async (_query, _root, args, ctx) => {
			return ctx.prisma.category.update({
				where: {
					id: args.id,
				},
				data: {
					...args.input,
				},
			});
		},
	}),
	deleteCategory: t.prismaField({
		type: Category,
		args: {
			id: t.arg({
				type: "ID",
				required: true,
			}),
		},
		resolve: async (_query, _root, args, ctx) => {
			return ctx.prisma.category.delete({
				where: {
					id: args.id,
				},
			});
		},
	}),
}));
