import { z } from "zod";
import { builder } from "../../builder";
import { ItemStatus } from "../../generated/prisma/enums";

export const Product = builder.prismaObject("Product", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		categoryId: t.exposeString("categoryId"),
		category: t.relation("category"),
		description: t.exposeString("description"),
		variants: t.relation("variants"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
	}),
});

export const ProductVariant = builder.prismaObject("ProductVariant", {
	fields: (t) => ({
		id: t.exposeID("id"),
		productId: t.exposeString("productId"),
		product: t.relation("product"),
		size: t.exposeString("size"),
		color: t.exposeString("color"),
		rentalPrice: t.exposeInt("rentalPrice"),
		deposit: t.exposeInt("deposit"),
		imageUrl: t.exposeString("imageUrl", { nullable: true }),
		items: t.relation("items"),
		itemsCount: t.relationCount("items"),
		availableCount: t.relationCount("items", {
			where: { status: ItemStatus.AVAILABLE },
		}),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
});

export const CreateProductInput = builder.inputType("CreateProductInput", {
	fields: (t) => ({
		name: t.string({
			required: true,
			validate: z
				.string()
				.min(1, "Tên sản phẩm không được để trống")
				.max(200, "Tên tối đa 200 ký tự"),
		}),
		categoryId: t.string({
			required: true,
			validate: z.uuid("ID danh mục không hợp lệ"),
		}),
		description: t.string({
			validate: z.string().max(1000, "Mô tả tối đa 1000 ký tự"),
		}),
	}),
});

export const CreateProductVariantInput = builder.inputType(
	"CreateProductVariantInput",
	{
		fields: (t) => ({
			productId: t.string({
				required: true,
				validate: z.uuid("ID sản phẩm không hợp lệ"),
			}),
			size: t.string({ defaultValue: "" }),
			color: t.string({ defaultValue: "" }),
			rentalPrice: t.int({
				required: true,
				validate: z.number().int().min(0, "Giá thuê phải >= 0"),
			}),
			deposit: t.int({
				required: true,
				validate: z.number().int().min(0, "Tiền cọc phải >= 0"),
			}),
			imageUrl: t.string(),
			image: t.field({ type: "File", required: false }),
		}),
	},
);

export const UpdateProductInput = builder.inputType("UpdateProductInput", {
	fields: (t) => ({
		name: t.string({
			validate: z
				.string()
				.min(1, "Tên sản phẩm không được để trống")
				.max(200, "Tên tối đa 200 ký tự"),
		}),
		categoryId: t.string({
			validate: z.uuid("ID danh mục không hợp lệ"),
		}),
		description: t.string({
			validate: z.string().max(1000, "Mô tả tối đa 1000 ký tự"),
		}),
	}),
});

export const UpdateProductVariantInput = builder.inputType(
	"UpdateProductVariantInput",
	{
		fields: (t) => ({
			size: t.string(),
			color: t.string(),
			rentalPrice: t.int({
				validate: z.number().int().min(0, "Giá thuê phải >= 0"),
			}),
			deposit: t.int({
				validate: z.number().int().min(0, "Tiền cọc phải >= 0"),
			}),
			imageUrl: t.string(),
			image: t.field({ type: "File", required: false }),
		}),
	},
);
