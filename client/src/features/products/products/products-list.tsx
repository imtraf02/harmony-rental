import { useSuspenseQuery } from "@apollo/client/react";
import {
	IconDotsVertical,
	IconEdit,
	IconPackage,
	IconTag,
	IconTrash,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductFragment } from "@/gql/graphql";
import { getCategoryIcon } from "@/lib/category-icons";
import { formatVnd } from "@/lib/format";
import { productsQuery } from "../graphql/queries";
import { useProducts } from "../common/products-provider";

interface Props {
	searchTerm: string;
}



function ProductCard({ product }: { product: ProductFragment }) {
	const { setOpen, setCurrentRow } = useProducts();
	const CategoryIcon = getCategoryIcon(product.category.name);

	const firstVariantWithImage = product.variants.find((v) => v.imageUrl);
	const imageUrl = firstVariantWithImage?.imageUrl
		? firstVariantWithImage.imageUrl.startsWith("http")
			? firstVariantWithImage.imageUrl
			: `http://localhost:4000${firstVariantWithImage.imageUrl}`
		: null;

	const prices = product.variants.map((v) => v.rentalPrice);
	const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
	const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
	const totalItems = product.variants.reduce(
		(acc, v) => acc + (v.itemsCount || 0),
		0,
	);
	const totalAvailable = product.variants.reduce(
		(acc, v) => acc + (v.availableCount || 0),
		0,
	);

	return (
		<li className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
			<div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
				<Link
					to="/products/$productId"
					params={{ productId: product.id }}
					className="block h-full w-full"
				>
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={product.name}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
							<IconPackage className="h-12 w-12" />
							<span className="text-xs font-medium">Chưa có ảnh</span>
						</div>
					)}
				</Link>

				<div className="absolute top-3 left-3">
					<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight bg-background/80 backdrop-blur-sm border shadow-sm uppercase">
						<CategoryIcon className="h-3 w-3 text-primary" />
						{product.category.name}
					</span>
				</div>

				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="secondary"
									size="icon"
									className="h-8 w-8 shadow-md backdrop-blur-sm bg-background/80"
								>
									<IconDotsVertical className="h-4 w-4" />
								</Button>
							}
						/>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onClick={() => {
									setCurrentRow(product);
									setOpen("update");
								}}
							>
								<IconEdit className="mr-2 h-4 w-4" />
								Chỉnh sửa
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => {
									setCurrentRow(product);
									setOpen("delete");
								}}
							>
								<IconTrash className="mr-2 h-4 w-4" />
								Xóa
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="flex flex-1 flex-col p-4 gap-3">
				<div>
					<Link
						to="/products/$productId"
						params={{ productId: product.id }}
						className="hover:text-primary transition-colors"
					>
						<h3 className="font-bold text-base leading-snug line-clamp-1">
							{product.name}
						</h3>
					</Link>
					<p className="text-xs mt-1 font-medium">
						{product.variants.length} biến thể •{" "}
						<span className={totalAvailable > 0 ? "text-green-600" : "text-red-600 font-bold"}>
							Còn {totalAvailable}/{totalItems} món
						</span>
					</p>
				</div>

				<div className="flex flex-col gap-1.5 border-t pt-3">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
							<IconTag className="h-3.5 w-3.5" />
							Giá thuê
						</span>
						<span className="text-sm font-black text-primary text-right">
							{minPrice === maxPrice
								? formatVnd(minPrice)
								: `${formatVnd(minPrice)} - ${formatVnd(maxPrice)}`}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-1 mt-auto">
					{product.variants.slice(0, 3).map((v) => (
						<span
							key={v.id}
							className="text-[10px] bg-muted/50 px-2 py-0.5 rounded-full border font-semibold text-muted-foreground"
						>
							{v.color} - {v.size}
						</span>
					))}
					{product.variants.length > 3 && (
						<span className="text-[10px] text-muted-foreground font-medium flex items-center">
							+{product.variants.length - 3}
						</span>
					)}
				</div>
			</div>
		</li>
	);
}

export function ProductsList({ searchTerm }: Props) {
	return (
		<Suspense
			fallback={
				<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
						<Skeleton key={i} className="h-80 rounded-xl" />
					))}
				</ul>
			}
		>
			<ProductsListInner searchTerm={searchTerm} />
		</Suspense>
	);
}

function ProductsListInner({ searchTerm }: Props) {
	const { data } = useSuspenseQuery(productsQuery);
	const filteredProducts = (data?.products ?? []).filter((p: ProductFragment) =>
		p.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (filteredProducts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-80 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
				<IconPackage className="h-16 w-16 mb-4 opacity-10" />
				<h3 className="text-lg font-semibold text-foreground/60">
					Không tìm thấy sản phẩm
				</h3>
				<p className="text-sm">Thử thay đổi từ khóa tìm kiếm của bạn</p>
			</div>
		);
	}

	return (
		<ul className="grid gap-5 pt-4 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{filteredProducts.map((product: ProductFragment) => (
				<ProductCard key={product.id} product={product} />
			))}
		</ul>
	);
}
