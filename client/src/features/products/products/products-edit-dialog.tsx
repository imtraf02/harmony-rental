import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
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
import type { ProductFragment, UpdateProductMutation } from "@/gql/graphql";
import { updateProduct } from "../graphql/mutations";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: ProductFragment;
}

const formSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
	categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
	description: z.string(),
});

export function ProductsEditDialog({ open, onOpenChange, currentRow }: Props) {
	const [mutate, { loading }] = useMutation<UpdateProductMutation>(
		updateProduct,
		{
			onCompleted: () => {
				toast.success("Cập nhật sản phẩm thành công");
				onOpenChange(false);
			},
			onError: (err) => toast.error(err.message),
		},
	);

	const form = useForm({
		defaultValues: {
			name: currentRow.name,
			categoryId: currentRow.categoryId,
			description: currentRow.description || "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await mutate({
				variables: {
					id: currentRow.id,
					input: value,
				},
			});
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form
					id="product-edit-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
						<DialogDescription>
							Cập nhật thông tin cơ bản cho {currentRow.name}.
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
						<Button type="submit" form="product-edit-form" disabled={loading}>
							{loading ? "Đang xử lý..." : "Lưu thay đổi"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
