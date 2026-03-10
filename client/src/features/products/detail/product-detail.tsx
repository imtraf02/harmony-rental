import { gql } from "@apollo/client";
import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import {
	IconArrowLeft,
	IconCategory,
	IconEdit,
	IconInfoCircle,
	IconLayoutGrid,
	IconPackage,
	IconPlus,
	IconTag,
	IconTrash,
} from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
	ProductFragment,
	ProductQuery,
	VariantFragment,
} from "@/gql/graphql";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { useProducts } from "../common/products-provider";
import { productQuery } from "../graphql/queries";
import { ProductRelatedPayments } from "./product-related-payments";

type VariantType = ProductQuery["product"]["variants"][number];
type ProductType = ProductQuery["product"];

const UPDATE_PRODUCT_VARIANT_IMAGE = gql`
	mutation UpdateProductVariantImage($id: ID!, $image: File!) {
		updateProductVariantImage(id: $id, image: $image) {
			id
			imageUrl
			updatedAt
		}
	}
`;

const getStatusLabel = (status: string) => {
	switch (status) {
		case "AVAILABLE":
			return "Sẵn sàng";
		case "RENTED":
			return "Đang thuê";
		case "MAINTENANCE":
			return "Bảo trì";
		default:
			return status;
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "AVAILABLE":
			return "bg-chart-2";
		case "RENTED":
			return "bg-chart-1";
		case "MAINTENANCE":
			return "bg-chart-5";
		default:
			return "bg-muted-foreground";
	}
};

export function ProductDetail() {
	const { productId } = useParams({ from: "/_app/products/$productId" });
	const { data, refetch } = useSuspenseQuery(productQuery, {
		variables: { id: productId },
	});
	const product = data.product as ProductType;
	const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(
		null,
	);
	const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

	const [updateVariantImage] = useMutation(UPDATE_PRODUCT_VARIANT_IMAGE, {
		onCompleted: async () => {
			await refetch();
			toast.success("Đã cập nhật ảnh biến thể.");
		},
		onError: (error) => {
			toast.error(error.message || "Không thể cập nhật ảnh biến thể.");
		},
	});

	const { setOpen, setCurrentRow, setCurrentVariant } = useProducts();
	const CategoryIcon = getCategoryIcon(product.category.name);

	const handleEditProduct = () => {
		setCurrentRow(product as unknown as ProductFragment);
		setOpen("update");
	};

	const handleDeleteProduct = () => {
		setCurrentRow(product as unknown as ProductFragment);
		setOpen("delete");
	};

	const handleAddVariant = () => {
		setCurrentRow(product as unknown as ProductFragment);
		setOpen("variant-create");
	};

	const handleEditVariant = (variant: VariantType) => {
		setCurrentVariant(variant as unknown as VariantFragment);
		setOpen("variant-update");
	};

	const handleDeleteVariant = (variant: VariantType) => {
		setCurrentVariant(variant as unknown as VariantFragment);
		setOpen("variant-delete");
	};

	const handleAddItem = (variant: VariantType) => {
		setCurrentRow(product as unknown as ProductFragment);
		setCurrentVariant(variant as unknown as VariantFragment);
		setOpen("item-create");
	};

	const openImagePicker = (variantId: string) => {
		imageInputRefs.current[variantId]?.click();
	};

	const handleVariantImageChange = async (
		variantId: string,
		file?: File | null,
	) => {
		if (!file) return;
		setUploadingVariantId(variantId);
		try {
			await updateVariantImage({
				variables: {
					id: variantId,
					image: file,
				},
			});
		} finally {
			setUploadingVariantId(null);
		}
	};

	const totalItems = product.variants.reduce(
		(acc: number, v: VariantType) => acc + (v.itemsCount || 0),
		0,
	);
	const totalAvailable = product.variants.reduce(
		(acc: number, v: VariantType) => acc + (v.availableCount || 0),
		0,
	);

	return (
		<>
			<Header>
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitcher />
				</div>
			</Header>

			<Main>
				<div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
					{/* ── Page header ── */}
					<div className="flex flex-wrap items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								nativeButton={false}
								render={<Link to="/products" />}
								className="rounded-full h-10 w-10 border border-border shadow-sm"
							>
								<IconArrowLeft className="h-5 w-5" />
							</Button>
							<div>
								<div className="flex items-center gap-2 flex-wrap">
									<h1 className="text-3xl font-extrabold tracking-tight text-foreground">
										{product.name}
									</h1>
									<span
										className={cn(
											"inline-flex items-center px-2.5 py-0.5 rounded-full",
											"text-xs font-bold border",
											"bg-primary/10 text-primary border-primary/20",
										)}
									>
										<CategoryIcon className="h-3 w-4 mr-1 text-primary" />
										{product.category.name}
									</span>
								</div>
								<p className="text-muted-foreground mt-1 font-medium flex items-center gap-2 text-sm">
									<IconCategory className="h-4 w-4" />
									ID: {product.id.split("-")[0]}... · {product.variants.length}{" "}
									biến thể ·{" "}
									<span
										className={cn(
											"font-bold",
											totalAvailable > 0 ? "text-chart-2" : "text-destructive",
										)}
									>
										{totalAvailable}/{totalItems} sẵn sàng
									</span>
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								className="gap-2 rounded-full px-4 text-destructive hover:bg-destructive/10"
								onClick={handleDeleteProduct}
							>
								<IconTrash className="h-4 w-4" />
								Xóa sản phẩm
							</Button>
							<Button
								className="gap-2 rounded-full px-6 shadow-md"
								onClick={handleEditProduct}
							>
								<IconEdit className="h-4 w-4" />
								Chỉnh sửa
							</Button>
						</div>
					</div>

					<div className="space-y-8">
						{/* Product info card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
									<IconInfoCircle className="h-4 w-4 text-primary" />
									Thông tin chi tiết
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div className="grid sm:grid-cols-2 gap-4">
										<div className="space-y-1.5 p-4 rounded-xl bg-muted/40 border border-border">
											<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
												<IconTag className="h-3 w-3" />
												Tên sản phẩm
											</span>
											<p className="text-base font-bold text-foreground">
												{product.name}
											</p>
										</div>
										<div className="space-y-1.5 p-4 rounded-xl bg-muted/40 border border-border">
											<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
												<IconCategory className="h-3 w-3" />
												Danh mục
											</span>
											<p className="text-base font-bold text-primary">
												{product.category.name}
											</p>
										</div>
									</div>
									<div className="p-4 rounded-xl bg-muted/40 border border-border">
										<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
											Mô tả sản phẩm
										</span>
										<p className="text-muted-foreground leading-relaxed italic text-sm">
											{product.description ||
												"Chưa có mô tả chi tiết cho sản phẩm này."}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Variants section */}
						<div className="space-y-4">
							<div className="flex items-center justify-between px-1">
								<h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-foreground">
									<IconLayoutGrid className="h-5 w-5 text-primary" />
									Danh sách biến thể
								</h2>
								<Button
									variant="outline"
									size="sm"
									className={cn(
										"rounded-full gap-2",
										"border-primary/20 text-primary hover:bg-primary/5",
									)}
									onClick={handleAddVariant}
								>
									<IconPlus className="h-4 w-4" />
									Thêm biến thể
								</Button>
							</div>

							<div className="flex flex-col gap-4">
								{product.variants.map((variant: VariantType) => (
									<Card
										key={variant.id}
										className="overflow-hidden border border-border transition-all hover:shadow-md rounded-2xl"
									>
										<div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-stretch">
											<div className="relative">
												<input
													ref={(element) => {
														imageInputRefs.current[variant.id] = element;
													}}
													type="file"
													accept="image/*"
													className="hidden"
													onChange={(event) => {
														void handleVariantImageChange(
															variant.id,
															event.target.files?.[0] ?? null,
														);
														event.currentTarget.value = "";
													}}
												/>
												<button
													type="button"
													className="group relative size-60 rounded-xl border border-border bg-muted overflow-hidden shadow-sm text-left"
													onClick={() => openImagePicker(variant.id)}
													disabled={uploadingVariantId === variant.id}
												>
													{variant.imageUrl ? (
														<img
															src={
																variant.imageUrl.startsWith("http")
																	? variant.imageUrl
																	: `http://localhost:4000${variant.imageUrl}`
															}
															className={cn(
																"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
																uploadingVariantId === variant.id &&
																	"opacity-60",
															)}
															alt={`${product.name} - ${variant.color} - ${variant.size}`}
														/>
													) : (
														<div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
															<IconPackage className="h-12 w-12" />
														</div>
													)}
													<div className="absolute inset-0 flex items-end justify-center bg-black/0 p-3 transition-colors group-hover:bg-black/40">
														<span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100">
															{uploadingVariantId === variant.id
																? "Đang tải ảnh..."
																: "Nhấn để đổi ảnh"}
														</span>
													</div>
												</button>
											</div>

											<div className="flex-1 space-y-4">
												<div className="flex flex-wrap items-start justify-between gap-2">
													<div className="space-y-2">
														<p className="text-base font-bold text-foreground">
															{product.name}
														</p>
														<div className="flex items-center gap-2 flex-wrap">
															<span className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground">
																Size: {variant.size || "Free"}
															</span>
															<span className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground">
																Màu: {variant.color || "Tự do"}
															</span>
														</div>
													</div>
													<div className="flex gap-1 shrink-0">
														<Button
															variant="secondary"
															size="sm"
															className="rounded-full gap-2 h-8 px-3 shadow-sm text-xs"
															onClick={() => handleAddItem(variant)}
														>
															<IconPlus className="h-3.5 w-3.5" />
															Thêm món
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="rounded-full border border-border hover:bg-primary/10 hover:text-primary h-8 px-3 text-xs"
															onClick={() => handleEditVariant(variant)}
														>
															<IconEdit className="h-3.5 w-3.5 mr-1" />
															Sửa
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="rounded-full border border-border hover:bg-destructive/10 hover:text-destructive h-8 px-3 text-xs"
															onClick={() => handleDeleteVariant(variant)}
														>
															<IconTrash className="h-3.5 w-3.5 mr-1" />
															Xóa
														</Button>
													</div>
												</div>

												<div className="flex flex-col sm:flex-row gap-3">
													<div className="rounded-lg border bg-muted/20 px-3 py-2 sm:flex-1">
														<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
															Giá thuê/ngày
														</p>
														<p className="font-extrabold text-primary text-sm mt-1">
															{new Intl.NumberFormat("vi-VN", {
																style: "currency",
																currency: "VND",
															}).format(variant.rentalPrice)}
														</p>
													</div>
													<div className="rounded-lg border bg-muted/20 px-3 py-2 sm:flex-1">
														<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
															Tiền cọc
														</p>
														<p className="font-bold text-sm mt-1 text-foreground">
															{new Intl.NumberFormat("vi-VN", {
																style: "currency",
																currency: "VND",
															}).format(variant.deposit)}
														</p>
													</div>
													<div className="rounded-lg border bg-muted/20 px-3 py-2 sm:flex-1">
														<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
															Tồn kho
														</p>
														<p className="font-black text-foreground text-sm mt-1">
															{variant.itemsCount || 0} món
														</p>
														<span className="text-[10px] font-bold text-chart-2 uppercase tracking-tighter">
															Sẵn sàng: {variant.availableCount || 0}
														</span>
													</div>
												</div>

												{variant.items && variant.items.length > 0 && (
													<div className="border-t border-border pt-4">
														<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
															Mã định danh trong kho
														</p>
														<div className="flex flex-wrap gap-2">
															{variant.items.map((item) => (
																<div
																	key={item.id}
																	className={cn(
																		"flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border",
																		"bg-background text-xs font-medium shadow-sm",
																	)}
																	title={item.note}
																>
																	<div
																		className={cn(
																			"h-1.5 w-1.5 rounded-full",
																			getStatusColor(item.status),
																		)}
																	/>
																	<span className="font-mono text-foreground">
																		{item.code}
																	</span>
																	<span className="text-muted-foreground/40 text-[10px]">
																		|
																	</span>
																	<span className="text-[10px] text-muted-foreground">
																		{getStatusLabel(item.status)}
																	</span>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>
						<ProductRelatedPayments productId={product.id} />
					</div>
				</div>
			</Main>
		</>
	);
}
