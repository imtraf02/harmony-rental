import type { Reference } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoriesSelect } from "@/features/categories/components/categories-select";
import type { CreateProductMutation } from "@/gql/graphql";
import { createProduct } from "../graphql/mutations";

interface ProductsCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
	categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
	description: z.string(),
});

export function ProductsCreateDialog({
	open,
	onOpenChange,
}: ProductsCreateDialogProps) {
	const navigate = useNavigate();

	const [mutate, { loading }] = useMutation<CreateProductMutation>(
		createProduct,
		{
			update(cache, { data }) {
				const newProduct = data?.createProduct;
				if (!newProduct) return;

				cache.modify<{
					products: readonly Reference[];
				}>({
					fields: {
						products(existingRefs = [], { toReference }) {
							const newRef = toReference(newProduct);
							if (!newRef) return existingRefs;
							return [newRef, ...existingRefs];
						},
					},
				});

				toast.success("Thêm sản phẩm thành công");
				onOpenChange(false);
				form.reset();
				navigate({
					to: "/products/$productId",
					params: { productId: newProduct.id },
				});
			},
		},
	);

	const form = useForm({
		defaultValues: {
			name: "",
			categoryId: "",
			description: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await mutate({
				variables: {
					input: value,
				},
			});
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form
					id="product-create-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Thêm sản phẩm mới</DialogTitle>
						<DialogDescription>
							Nhập thông tin cơ bản cho sản phẩm mới.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="py-4">
						<form.Field name="categoryId">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldContent>
											<FieldLabel htmlFor="product-category-select">
												Danh mục
											</FieldLabel>
											<Suspense
												fallback={
													<Select>
														<SelectTrigger disabled>
															<SelectValue placeholder="Đang tải..." />
														</SelectTrigger>
													</Select>
												}
											>
												<CategoriesSelect
													value={field.state.value}
													onValueChange={field.handleChange}
													isInvalid={isInvalid}
												/>
											</Suspense>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</FieldContent>
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="name">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tên sản phẩm</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Ví dụ: Váy cưới cao cấp..."
											aria-invalid={isInvalid}
											autoFocus
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="description">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Mô tả</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Mô tả về sản phẩm này..."
												aria-invalid={isInvalid}
												rows={3}
											/>
										</InputGroup>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Hủy
						</Button>
						<Button type="submit" form="product-create-form" disabled={loading}>
							{loading ? "Đang xử lý..." : "Thêm sản phẩm"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
