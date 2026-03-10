import type { Reference } from "@apollo/client";
import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { Suspense, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldLabel,
	FieldError,
	FieldContent,
	FieldGroup,
	FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { categories as categoriesQuery } from "@/features/categories/graphql";
import { createItem, createProduct, createProductVariant, productsQuery, productVariantsQuery } from "../graphql";
import type { 
	CreateItemMutation, 
	CreateProductMutation, 
	CreateProductVariantMutation,
	CreateProductMutationVariables,
	CreateProductVariantMutationVariables,
	CreateItemMutationVariables
} from "@/gql/graphql";

type MutateFn<TData, TVariables> = any;

interface ItemsCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialProductId?: string;
	initialVariantId?: string;
}

export function ItemsCreateDialog({
	open,
	onOpenChange,
	initialProductId,
	initialVariantId,
}: ItemsCreateDialogProps) {
	const [step, setStep] = useState<"product" | "variant" | "item">(
		initialVariantId ? "item" : initialProductId ? "variant" : "product",
	);
	const [selectedProductId, setSelectedProductId] = useState<string | null>(
		initialProductId || null,
	);
	const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
		initialVariantId || null,
	);

	// Update state when props change or dialog opens
	useEffect(() => {
		if (open) {
			if (initialVariantId) {
				setStep("item");
				setSelectedVariantId(initialVariantId);
				setSelectedProductId(initialProductId || null);
			} else if (initialProductId) {
				setStep("variant");
				setSelectedProductId(initialProductId);
				setSelectedVariantId(null);
			} else {
				setStep("product");
				setSelectedProductId(null);
				setSelectedVariantId(null);
			}
		}
	}, [open, initialProductId, initialVariantId]);

	const [mutateCreateProduct] = useMutation<CreateProductMutation, CreateProductMutationVariables>(createProduct);
	const [mutateCreateVariant] = useMutation<CreateProductVariantMutation, CreateProductVariantMutationVariables>(createProductVariant);
	const [mutateCreateItem, { loading }] = useMutation<CreateItemMutation, CreateItemMutationVariables>(createItem, {
		update(cache, { data }) {
			const newItem = data?.createItem;
			if (!newItem) return;

			cache.modify<{ items: readonly Reference[] }>({
				fields: {
					items(existingRefs = [], { toReference }) {
						const newRef = toReference(newItem);
						if (!newRef) return existingRefs;
						return [newRef, ...existingRefs];
					},
				},
			});
		},
	});

	const resetAll = () => {
		setStep(initialVariantId ? "item" : initialProductId ? "variant" : "product");
		setSelectedProductId(initialProductId || null);
		setSelectedVariantId(initialVariantId || null);
	};

	return (
		<Dialog open={open} onOpenChange={(o) => { if(!o) resetAll(); onOpenChange(o); }}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Thêm sản phẩm</DialogTitle>
					<DialogDescription>
						{step === "product" && "Bước 1: Chọn hoặc tạo sản phẩm gốc"}
						{step === "variant" && "Bước 2: Chọn hoặc tạo biến thể (Size/Màu)"}
						{step === "item" && "Bước 3: Nhập mã định danh cho mẫu đồ này"}
					</DialogDescription>
				</DialogHeader>

				<div className="py-2">
					<Suspense fallback={<div className="flex h-40 items-center justify-center text-muted-foreground italic">Đang tải dữ liệu...</div>}>
						{step === "product" && (
							<ProductStep 
								selectedProductId={selectedProductId}
								setSelectedProductId={setSelectedProductId}
								setStep={setStep}
								mutateCreateProduct={mutateCreateProduct}
							/>
						)}
	
						{step === "variant" && selectedProductId && (
							<VariantStep 
								selectedProductId={selectedProductId}
								setSelectedVariantId={setSelectedVariantId}
								setStep={setStep}
								mutateCreateVariant={mutateCreateVariant}
							/>
						)}
	
						{step === "item" && selectedVariantId && (
							<ItemStep 
								selectedVariantId={selectedVariantId}
								setStep={setStep}
								mutateCreateItem={mutateCreateItem}
								loading={loading}
								onOpenChange={onOpenChange}
								resetAll={resetAll}
							/>
						)}
					</Suspense>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface ProductStepProps {
	selectedProductId: string | null;
	setSelectedProductId: (id: string | null) => void;
	setStep: (step: "product" | "variant" | "item") => void;
	mutateCreateProduct: MutateFn<CreateProductMutation, CreateProductMutationVariables>;
}

function ProductStep({ selectedProductId, setSelectedProductId, setStep, mutateCreateProduct }: ProductStepProps) {
	const { data: categoriesData } = useSuspenseQuery(categoriesQuery);
	const { data: productsData } = useSuspenseQuery(productsQuery);

	const formProduct = useForm({
		defaultValues: { name: "", categoryId: "", description: "" },
		onSubmit: async ({ value }) => {
			try {
				const { data } = await mutateCreateProduct({
					variables: { input: value },
				});
				if (data?.createProduct) {
					setSelectedProductId(data.createProduct.id);
					setStep("variant");
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
			}
		},
	});

	return (
		<div className="space-y-6 pt-2">
			<FieldGroup>
				<Field>
					<FieldLabel>Chọn sản phẩm có sẵn</FieldLabel>
					<Select 
						value={selectedProductId || ""} 
						onValueChange={(v) => {
							setSelectedProductId(v);
							setStep("variant");
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn sản phẩm..." />
						</SelectTrigger>
						<SelectContent>
							{productsData?.products?.map((p) => (
								<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldDescription>Sử dụng sản phẩm đã tồn tại trong danh sách.</FieldDescription>
				</Field>
			</FieldGroup>
			
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Hoặc tạo mới</span>
				</div>
			</div>

			<form onSubmit={(e) => { e.preventDefault(); formProduct.handleSubmit(); }}>
				<FieldGroup>
					<formProduct.Field name="name">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Tên sản phẩm</FieldLabel>
									<Input 
										id={field.name}
										value={field.state.value} 
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)} 
										placeholder="VD: Vest Nam Cưới" 
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</formProduct.Field>
					<formProduct.Field name="categoryId">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldContent>
										<FieldLabel htmlFor="item-category-select">Danh mục</FieldLabel>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</FieldContent>
									<Select value={field.state.value} onValueChange={(v) => v && field.handleChange(v)}>
										<SelectTrigger id="item-category-select" aria-invalid={isInvalid}>
											<SelectValue placeholder="Chọn danh mục..." />
										</SelectTrigger>
										<SelectContent>
											{categoriesData?.categories?.map((c) => (
												<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							);
						}}
					</formProduct.Field>
					<Button type="submit" className="w-full mt-2">Tiếp tục bước 2</Button>
				</FieldGroup>
			</form>
		</div>
	);
}

interface VariantStepProps {
	selectedProductId: string;
	setSelectedVariantId: (id: string | null) => void;
	setStep: (step: "product" | "variant" | "item") => void;
	mutateCreateVariant: MutateFn<CreateProductVariantMutation, CreateProductVariantMutationVariables>;
}

function VariantStep({ selectedProductId, setSelectedVariantId, setStep, mutateCreateVariant }: VariantStepProps) {
	const formVariant = useForm({
		defaultValues: { size: "", color: "", rentalPrice: 0, deposit: 0, imageUrl: "" },
		onSubmit: async ({ value }) => {
			if (!selectedProductId) return;
			try {
				const { data } = await mutateCreateVariant({
					variables: {
						input: { ...value, productId: selectedProductId },
					},
				});
				if (data?.createProductVariant) {
					setSelectedVariantId(data.createProductVariant.id);
					setStep("item");
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
			}
		},
	});

	return (
		<div className="space-y-6 pt-2">
			<Suspense fallback={<div className="h-20 flex items-center justify-center text-sm text-muted-foreground italic">Đang tải biến thể...</div>}>
				<VariantSelector 
					productId={selectedProductId} 
					onSelect={(vid) => { setSelectedVariantId(vid); setStep("item"); }} 
				/>
			</Suspense>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Tạo biến thể mới</span>
				</div>
			</div>

			<form onSubmit={(e) => { e.preventDefault(); formVariant.handleSubmit(); }}>
				<FieldGroup>
					<div className="grid grid-cols-2 gap-2">
						<formVariant.Field name="size">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Kích cỡ</FieldLabel>
										<Input 
											id={field.name}
											value={field.state.value} 
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)} 
											placeholder="M, L..." 
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</formVariant.Field>
						<formVariant.Field name="color">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Màu sắc</FieldLabel>
										<Input 
											id={field.name}
											value={field.state.value} 
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)} 
											placeholder="Đen..." 
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</formVariant.Field>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<formVariant.Field name="rentalPrice">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Giá thuê</FieldLabel>
										<Input 
											id={field.name}
											type="number" 
											value={field.state.value} 
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(Number(e.target.value))} 
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</formVariant.Field>
						<formVariant.Field name="deposit">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tiền cọc</FieldLabel>
										<Input 
											id={field.name}
											type="number" 
											value={field.state.value} 
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(Number(e.target.value))} 
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</formVariant.Field>
					</div>
					<Button type="submit" className="w-full mt-2">Tiếp tục bước 3</Button>
					<Button type="button" variant="ghost" onClick={() => setStep("product")} className="w-full">Quay lại</Button>
				</FieldGroup>
			</form>
		</div>
	);
}

interface ItemStepProps {
	selectedVariantId: string;
	setStep: (step: "product" | "variant" | "item") => void;
	mutateCreateItem: MutateFn<CreateItemMutation, CreateItemMutationVariables>;
	loading: boolean;
	onOpenChange: (open: boolean) => void;
	resetAll: () => void;
}

function ItemStep({ selectedVariantId, setStep, mutateCreateItem, loading, onOpenChange, resetAll }: ItemStepProps) {
	const formItem = useForm({
		defaultValues: { code: "", note: "" },
		onSubmit: async ({ value }) => {
			if (!selectedVariantId) return;
			try {
				await mutateCreateItem({
					variables: {
						input: { ...value, variantId: selectedVariantId },
					},
				});
				toast.success("Thêm sản phẩm thành công");
				onOpenChange(false);
				resetAll();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
			}
		},
	});

	return (
		<form onSubmit={(e) => { e.preventDefault(); formItem.handleSubmit(); }} className="pt-2">
			<FieldGroup>
				<formItem.Field name="code">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Mã định danh (Barcode/Code)</FieldLabel>
								<Input 
									id={field.name}
									value={field.state.value} 
									onBlur={field.handleBlur}
									onChange={e => field.handleChange(e.target.value)} 
									placeholder="VD: VT-001-01" 
									autoFocus 
									aria-invalid={isInvalid}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</formItem.Field>
				<formItem.Field name="note">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Ghi chú tình trạng</FieldLabel>
								<Input 
									id={field.name}
									value={field.state.value} 
									onBlur={field.handleBlur}
									onChange={e => field.handleChange(e.target.value)} 
									placeholder="Mới 100%..." 
									aria-invalid={isInvalid}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</formItem.Field>
				<Button type="submit" className="w-full mt-2" disabled={loading}>Hoàn tất thêm đồ</Button>
				<Button type="button" variant="ghost" onClick={() => setStep("variant")} className="w-full">Quay lại</Button>
			</FieldGroup>
		</form>
	);
}

function VariantSelector({ productId, onSelect }: { productId: string, onSelect: (id: string) => void }) {
	const { data } = useSuspenseQuery(productVariantsQuery, { variables: { productId } });
	if (!data?.productVariants || data.productVariants.length === 0) return null;

	return (
		<FieldGroup>
			<Field>
				<FieldLabel>Chọn biến thể có sẵn</FieldLabel>
				<div className="grid grid-cols-2 gap-2">
					{data.productVariants.map((v) => (
						<Button key={v.id} variant="outline" className="justify-start h-auto py-2 px-3 flex-col items-start" onClick={() => onSelect(v.id)}>
							<span className="text-sm font-semibold">{v.color} - Size {v.size}</span>
							<span className="text-[10px] text-muted-foreground">{new Intl.NumberFormat("vi-VN").format(v.rentalPrice)}đ</span>
						</Button>
					))}
				</div>
				<FieldDescription>Chọn một biến thể đã có nếu không muốn tạo mới.</FieldDescription>
			</Field>
		</FieldGroup>
	);
}
