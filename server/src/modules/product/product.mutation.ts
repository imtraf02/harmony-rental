import { GraphQLError } from "graphql";
import { builder } from "../../builder";
import { deleteUploadedFile, saveFile } from "../../utils/file";
import {
	CreateProductInput,
	CreateProductVariantInput,
	Product,
	ProductVariant,
	UpdateProductInput,
	UpdateProductVariantInput,
} from "./product.model";

builder.mutationFields((t) => ({
	createProduct: t.prismaField({
		type: Product,
		args: {
			input: t.arg({ type: CreateProductInput, required: true }),
		},
		resolve: async (query, _root, { input }, ctx) => {
			return ctx.prisma.product.create({
				...query,
				data: {
					name: input.name,
					categoryId: input.categoryId,
					description: input.description ?? "",
				},
			});
		},
	}),
	updateProduct: t.prismaField({
		type: Product,
		args: {
			id: t.arg.id({ required: true }),
			input: t.arg({ type: UpdateProductInput, required: true }),
		},
		resolve: async (query, _root, { id, input }, ctx) => {
			return ctx.prisma.product.update({
				...query,
				where: { id: String(id) },
				data: {
					name: input.name ?? undefined,
					categoryId: input.categoryId ?? undefined,
					description: input.description ?? undefined,
				},
			});
		},
	}),
	deleteProduct: t.prismaField({
		type: Product,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return ctx.prisma.product.delete({
				...query,
				where: { id: String(id) },
			});
		},
	}),
	createProductVariant: t.prismaField({
		type: ProductVariant,
		args: {
			input: t.arg({ type: CreateProductVariantInput, required: true }),
		},
		resolve: async (query, _root, { input }, ctx) => {
			let imageUrl = input.imageUrl;
			if (input.image) {
				imageUrl = await saveFile(input.image as unknown as File);
			}

			return ctx.prisma.productVariant.create({
				...query,
				data: {
					productId: input.productId,
					size: input.size ?? "",
					color: input.color ?? "",
					rentalPrice: input.rentalPrice,
					deposit: input.deposit,
					imageUrl,
				},
			});
		},
	}),
	updateProductVariant: t.prismaField({
		type: ProductVariant,
		args: {
			id: t.arg.id({ required: true }),
			input: t.arg({ type: UpdateProductVariantInput, required: true }),
		},
		resolve: async (query, _root, { id, input }, ctx) => {
			const existing = await ctx.prisma.productVariant.findUnique({
				where: { id: String(id) },
			});
			if (!existing) {
				throw new GraphQLError("Biến thể không tồn tại");
			}

			let imageUrl = input.imageUrl ?? undefined;
			if (input.image) {
				imageUrl = await saveFile(input.image as unknown as File);
				await deleteUploadedFile(existing.imageUrl);
			}

			return ctx.prisma.productVariant.update({
				...query,
				where: { id: String(id) },
				data: {
					size: input.size ?? undefined,
					color: input.color ?? undefined,
					rentalPrice: input.rentalPrice ?? undefined,
					deposit: input.deposit ?? undefined,
					imageUrl,
				},
			});
		},
	}),
	updateProductVariantImage: t.prismaField({
		type: ProductVariant,
		args: {
			id: t.arg.id({ required: true }),
			image: t.arg({ type: "File", required: true }),
		},
		resolve: async (query, _root, { id, image }, ctx) => {
			const existing = await ctx.prisma.productVariant.findUnique({
				where: { id: String(id) },
			});
			if (!existing) {
				throw new GraphQLError("Biến thể không tồn tại");
			}

			const newImageUrl = await saveFile(image as unknown as File);
			await deleteUploadedFile(existing.imageUrl);

			return ctx.prisma.productVariant.update({
				...query,
				where: { id: String(id) },
				data: {
					imageUrl: newImageUrl,
				},
			});
		},
	}),
	deleteProductVariant: t.prismaField({
		type: ProductVariant,
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (query, _root, { id }, ctx) => {
			return ctx.prisma.productVariant.delete({
				...query,
				where: { id: String(id) },
			});
		},
	}),
}));
