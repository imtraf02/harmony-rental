import { useMutation } from "@apollo/client/react";
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createProduct, createProductVariant } from "../graphql/mutations";
import { productsQuery } from "../graphql/queries";
import { ImageUpload } from "@/components/image-upload";

const variantSchema = z.object({
	id: z.string(),
	size: z.string().min(1, "Vui lòng nhập kích cỡ"),
	color: z.string().min(1, "Vui lòng nhập màu sắc"),
	rentalPrice: z.number().min(0, "Giá thuê không được âm"),
	deposit: z.number().min(0, "Tiền cọc không được âm"),
	image: z.instanceof(File).nullable(),
});

const productSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
	categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
	description: z.string(),
	variants: z.array(variantSchema).min(1, "Vui lòng thêm ít nhất một biến thể"),
});

export function ProductCreateForm() {
	const navigate = useNavigate();
	const [mutateCreateProduct, { loading: creatingProduct }] =
		useMutation(createProduct);
	const [mutateCreateVariant] = useMutation(createProductVariant);

	const form = useForm({
		defaultValues: {
			name: "",
			categoryId: "",
			description: "",
			variants: [
				{
					id: Math.random().toString(36).substring(7),
					size: "",
					color: "",
					rentalPrice: 0,
					deposit: 0,
					image: null as File | null,
				},
			],
		},
		validators: {
			onSubmit: productSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				// 1. Create Product
				const { data: pData } = await mutateCreateProduct({
					variables: {
						input: {
							name: value.name,
							categoryId: value.categoryId,
							description: value.description,
						},
					},
					refetchQueries: [{ query: productsQuery }],
				});

				const productId = pData?.createProduct?.id;
				if (!productId) throw new Error("Không thể tạo sản phẩm");

				// 2. Create Variants
				await Promise.all(
					value.variants.map(({ id: _, ...v }) =>
						mutateCreateVariant({
							variables: {
								input: {
									...v,
									productId,
								},
							},
						}),
					),
				);

				toast.success("Tạo sản phẩm và các biến thể thành công!");
				navigate({ to: "/products" });
			} catch (err) {
				const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
				toast.error(message);
			}
		},
	});

	return (
		<>
			<Header />

			<Main>
				<div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							nativeButton={false}
							render={<Link to="/products" />}
							className="rounded-full"
						>
							<IconArrowLeft className="h-5 w-5" />
						</Button>
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight">
								Thêm sản phẩm mới
							</h1>
							<p className="text-muted-foreground mt-1">
								Khởi tạo sản phẩm mới cùng các biến thể màu sắc và kích cỡ.
							</p>
						</div>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<Card>
							<CardHeader>
								<CardTitle>Thông tin cơ bản</CardTitle>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<form.Field name="name">
											{(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;
												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel htmlFor={field.name}>
															Tên sản phẩm
														</FieldLabel>
														<Input
															id={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															placeholder="VD: Vest Nam Hàn Quốc"
															aria-invalid={isInvalid}
															className="bg-background/50"
														/>
														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
										</form.Field>
										<form.Field name="categoryId">
											{(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;
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
									</div>
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
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															placeholder="Thông tin thêm về chất liệu, kiểu dáng, phong cách..."
															aria-invalid={isInvalid}
															className="min-h-28 bg-background/50"
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
							</CardContent>
						</Card>

						<form.Field name="variants" mode="array">
							{(field) => (
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-2xl font-bold tracking-tight">
												Biến thể sản phẩm
											</h2>
											<p className="text-sm text-muted-foreground mt-1">
												Thêm các tùy chọn về màu sắc, kích cỡ và giá riêng biệt.
											</p>
										</div>
										<Button
											type="button"
											variant="secondary"
											size="sm"
											onClick={() =>
												field.pushValue({
													id: Math.random().toString(36).substring(7),
													size: "",
													color: "",
													rentalPrice: 0,
													deposit: 0,
													image: null as File | null,
												})
											}
											className="gap-2 shadow-sm rounded-full"
										>
											<IconPlus className="h-4 w-4" />
											Thêm biến thể
										</Button>
									</div>

									<FieldGroup className="grid gap-6">
										{field.state.value.map((variant) => {
											const index = field.state.value.findIndex((v) => v.id === variant.id);
											return (
												<Card
													key={variant.id}
													className="relative group overflow-hidden border-none shadow transition-shadow hover:shadow-md bg-card/50"
												>
													{field.state.value.length > 1 && (
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() => field.removeValue(index)}
														>
															<IconTrash className="h-4 w-4" />
														</Button>
													)}
													<CardContent className="pt-6">
														<div className="grid md:grid-cols-4 gap-8 items-start">
															<div className="md:col-span-1">
																<form.Field name={`variants[${index}].image`}>
																	{(subField) => (
																		<ImageUpload
																			file={subField.state.value}
																			onChange={(file) => subField.handleChange(file as File | null)}
																		/>
																	)}
																</form.Field>
															</div>
														<div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
															<form.Field name={`variants[${index}].color`}>
																{(subField) => {
																	const isInvalid =
																		subField.state.meta.isTouched &&
																		!subField.state.meta.isValid;
																	return (
																		<Field data-invalid={isInvalid}>
																			<FieldLabel htmlFor={subField.name}>
																				Màu sắc
																			</FieldLabel>
																			<Input
																				id={subField.name}
																				value={subField.state.value}
																				onBlur={subField.handleBlur}
																				onChange={(e) =>
																					subField.handleChange(e.target.value)
																				}
																				placeholder="VD: Đắng, Trắng sứ..."
																				aria-invalid={isInvalid}
																			/>
																			{isInvalid && (
																				<FieldError
																					errors={subField.state.meta.errors}
																				/>
																			)}
																		</Field>
																	);
																}}
															</form.Field>
															<form.Field name={`variants[${index}].size`}>
																{(subField) => {
																	const isInvalid =
																		subField.state.meta.isTouched &&
																		!subField.state.meta.isValid;
																	return (
																		<Field data-invalid={isInvalid}>
																			<FieldLabel htmlFor={subField.name}>
																				Kích cỡ
																			</FieldLabel>
																			<Input
																				id={subField.name}
																				value={subField.state.value}
																				onBlur={subField.handleBlur}
																				onChange={(e) =>
																					subField.handleChange(e.target.value)
																				}
																				placeholder="VD: S, M, L hoặc 39, 40..."
																				aria-invalid={isInvalid}
																			/>
																			{isInvalid && (
																				<FieldError
																					errors={subField.state.meta.errors}
																				/>
																			)}
																		</Field>
																	);
																}}
															</form.Field>
															<form.Field
																name={`variants[${index}].rentalPrice`}
															>
																{(subField) => {
																	const isInvalid =
																		subField.state.meta.isTouched &&
																		!subField.state.meta.isValid;
																	return (
																		<Field data-invalid={isInvalid}>
																			<FieldLabel htmlFor={subField.name}>
																				Giá thuê (VNĐ)
																			</FieldLabel>
																			<Input
																				id={subField.name}
																				type="number"
																				value={subField.state.value}
																				onBlur={subField.handleBlur}
																				onChange={(e) =>
																					subField.handleChange(
																						Number(e.target.value),
																					)
																				}
																				aria-invalid={isInvalid}
																			/>
																			{isInvalid && (
																				<FieldError
																					errors={subField.state.meta.errors}
																				/>
																			)}
																		</Field>
																	);
																}}
															</form.Field>
															<form.Field name={`variants[${index}].deposit`}>
																{(subField) => {
																	const isInvalid =
																		subField.state.meta.isTouched &&
																		!subField.state.meta.isValid;
																	return (
																		<Field data-invalid={isInvalid}>
																			<FieldLabel htmlFor={subField.name}>
																				Tiền đặt cọc (VNĐ)
																			</FieldLabel>
																			<Input
																				id={subField.name}
																				type="number"
																				value={subField.state.value}
																				onBlur={subField.handleBlur}
																				onChange={(e) =>
																					subField.handleChange(
																						Number(e.target.value),
																					)
																				}
																				aria-invalid={isInvalid}
																			/>
																			{isInvalid && (
																				<FieldError
																					errors={subField.state.meta.errors}
																				/>
																			)}
																		</Field>
																	);
																}}
															</form.Field>
														</div>
													</div>
												</CardContent>
											</Card>
													);
												})}
									</FieldGroup>
								</div>
							)}
						</form.Field>

						<div className="flex items-center justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background/80 backdrop-blur-md py-4 z-10">
							<Button
								variant="outline"
								type="button"
								nativeButton={false}
								render={<Link to="/products" />}
								className="rounded-full px-8"
							>
								Hủy bỏ
							</Button>
							<Button
								type="submit"
								size="lg"
								disabled={creatingProduct}
								className="rounded-full px-12 shadow-lg shadow-primary/20"
							>
								{creatingProduct ? "Đang xử lý..." : "Lưu sản phẩm"}
							</Button>
						</div>
					</form>
				</div>
			</Main>
		</>
	);
}
