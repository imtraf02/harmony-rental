import { z } from "zod";
import { builder } from "../../builder";

export const Category = builder.prismaObject("Category", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		description: t.exposeString("description"),
		products: t.relation("products"),
	}),
});

export const CreateCategoryInput = builder.inputType("CreateCategoryInput", {
	fields: (t) => ({
		name: t.string({
			required: true,
			validate: z.string().min(1, "Tên không được để trống").max(100, "Tên tối đa 100 ký tự"),
		}),
		description: t.string({
			required: true,
			validate: z.string().max(500, "Mô tả tối đa 500 ký tự"),
		}),
	}),
});

export const UpdateCategoryInput = builder.inputType("UpdateCategoryInput", {
	fields: (t) => ({
		name: t.string({
			required: true,
			validate: z.string().min(1, "Tên không được để trống").max(100, "Tên tối đa 100 ký tự"),
		}),
		description: t.string({
			required: true,
			validate: z.string().max(500, "Mô tả tối đa 500 ký tự"),
		}),
	}),
});
