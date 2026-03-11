import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/client/react";
import {
	IconCalendarTime,
	IconDotsVertical,
	IconPackage,
	IconPencil,
	IconShield,
	IconTag,
	IconTrash,
} from "@tabler/icons-react";
import { Suspense } from "react";
import { formatDate, formatShortDate, formatVnd } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { ItemStatus } from "@/gql/graphql";
import { useItems } from "./items-provider";

type InventoryFutureRental = {
	orderId: string;
	orderCode: string;
	rentalDate: string;
	returnDate: string;
	customerName: string;
};

type InventoryItem = {
	id: string;
	code: string;
	variantId: string;
	status: ItemStatus;
	note: string;
	createdAt: string;
	updatedAt: string;
	futureRentals: InventoryFutureRental[];
	variant: {
		id: string;
		productId: string;
		size: string;
		color: string;
		rentalPrice: number;
		deposit: number;
		imageUrl?: string | null;
		itemsCount: number;
		availableCount: number;
		createdAt: string;
		updatedAt: string;
		product: {
			id: string;
			name: string;
			categoryId: string;
			category: {
				id: string;
			};
		};
	};
};

type ItemsQueryResponse = {
	items: InventoryItem[];
};

const INVENTORY_ITEMS_QUERY = gql`
	query InventoryItems($variantId: String) {
		items(variantId: $variantId) {
			id
			code
			variantId
			status
			note
			createdAt
			updatedAt
			futureRentals {
				orderId
				orderCode
				rentalDate
				returnDate
				customerName
			}
			variant {
				id
				productId
				size
				color
				rentalPrice
				deposit
				imageUrl
				itemsCount
				availableCount
				createdAt
				updatedAt
				product {
					id
					name
					categoryId
					category {
						id
					}
				}
			}
		}
	}
`;

interface Props {
	searchTerm?: string;
	sort?: "asc" | "desc";
	selectedStatuses?: Set<string>;
}



function getStatusConfig(status: ItemStatus) {
	switch (status) {
		case "AVAILABLE":
			return {
				label: "Sẵn sàng",
				dot: "bg-emerald-500",
				className:
					"bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
			};
		case "RENTED":
			return {
				label: "Đang thuê",
				dot: "bg-blue-500",
				className:
					"bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
			};
		case "MAINTENANCE":
			return {
				label: "Bảo trì",
				dot: "bg-amber-500",
				className:
					"bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
			};
		default:
			return {
				label: status,
				dot: "bg-muted-foreground",
				className: "",
			};
	}
}

function ItemsListSkeleton() {
	return (
		<ul className="no-scrollbar grid gap-5 overflow-auto pt-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"].map(
				(key, i) => (
					<li
						key={key}
						className="flex flex-col rounded-xl overflow-hidden border"
					>
						<Skeleton
							className="h-52 w-full rounded-none"
							style={{ animationDelay: `${i * 60}ms` }}
						/>
						<div className="p-4 space-y-2">
							<Skeleton
								className="h-4 w-2/3"
								style={{ animationDelay: `${i * 60 + 30}ms` }}
							/>
							<Skeleton
								className="h-3 w-1/2"
								style={{ animationDelay: `${i * 60 + 60}ms` }}
							/>
							<Skeleton
								className="h-3 w-3/4"
								style={{ animationDelay: `${i * 60 + 90}ms` }}
							/>
						</div>
					</li>
				),
			)}
		</ul>
	);
}

function ItemsEmpty() {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<IconPackage className="h-8 w-8 opacity-40" />
			</div>
			<div>
				<p className="font-semibold text-foreground">Chưa có sản phẩm nào</p>
				<p className="text-sm mt-1">Nhấn "Thêm sản phẩm" để bắt đầu.</p>
			</div>
		</div>
	);
}

function ItemCard({ item }: { item: InventoryItem }) {
	const { setOpen, setCurrentRow } = useItems();
	const statusConfig = getStatusConfig(item.status);
	const imageUrl = item.variant.imageUrl
		? item.variant.imageUrl.startsWith("http")
			? item.variant.imageUrl
			: `http://localhost:4000${item.variant.imageUrl}`
		: null;

	return (
		<li className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
			{/* Image area */}
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={item.variant.product.name}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
						<IconPackage className="h-12 w-12" />
						<span className="text-xs">Chưa có ảnh</span>
					</div>
				)}

				{/* Status badge overlaid on image */}
				<div className="absolute top-3 left-3">
					<span
						className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${statusConfig.className}`}
					>
						<span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
						{statusConfig.label}
					</span>
				</div>

				{/* Actions menu overlaid on image */}
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
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									setCurrentRow(item);
									setOpen("update");
								}}
							>
								<IconPencil className="mr-2 h-4 w-4" />
								Chỉnh sửa
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => {
									setCurrentRow(item);
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

			{/* Content area */}
			<div className="flex flex-1 flex-col p-4 gap-3">
				{/* Header */}
				<div>
					<div className="flex items-center gap-1.5 mb-1">
						<span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase">
							{item.code}
						</span>
					</div>
					<h3 className="font-semibold text-base leading-snug line-clamp-1">
						{item.variant.product.name}
					</h3>
					<p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">
						{item.variant.color}{" "}
						{item.variant.size && `• Size ${item.variant.size}`}
					</p>
				</div>

				{/* Pricing */}
				<div className="flex flex-col gap-1.5 border-t pt-3">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconTag className="h-3.5 w-3.5" />
							Giá thuê
						</span>
						<span className="text-sm font-bold text-primary">
							{formatVnd(item.variant.rentalPrice)}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconShield className="h-3.5 w-3.5" />
							Tiền cọc
						</span>
						<span className="text-sm font-medium text-foreground">
							{formatVnd(item.variant.deposit)}
						</span>
					</div>
				</div>

				{/* Note */}
				{item.note && (
					<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-muted/30 p-2 rounded border border-dashed">
						{item.note}
					</p>
				)}

				{item.futureRentals.length > 0 && (
					<div className="border-t pt-3">
						<div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<IconCalendarTime className="h-3.5 w-3.5" />
							Lịch thuê sắp tới
						</div>
						<div className="space-y-2">
							{item.futureRentals.map((rental) => (
								<div
									key={rental.orderId}
									className="rounded-lg border border-blue-500/15 bg-blue-500/5 px-3 py-2 text-xs"
								>
									<div className="flex items-center justify-between gap-2">
										<span className="font-semibold text-foreground">
											{rental.orderCode}
										</span>
										<span className="text-muted-foreground">
											{formatShortDate(rental.rentalDate)} -{" "}
											{formatDate(rental.returnDate)}
										</span>
									</div>
									<div className="mt-1 text-muted-foreground">
										Khách: {rental.customerName}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</li>
	);
}

function ItemsListInner({
	searchTerm = "",
	sort = "asc",
	selectedStatuses = new Set(),
}: Props) {
	const { data } = useSuspenseQuery<ItemsQueryResponse>(INVENTORY_ITEMS_QUERY);
	const items = (data?.items ?? [])
		.filter((item) => {
			const productName = item.variant.product.name.toLowerCase();
			const itemCode = item.code.toLowerCase();
			const term = searchTerm.toLowerCase();

			const matchesSearch =
				productName.includes(term) || itemCode.includes(term);
			const matchesStatus =
				selectedStatuses.size === 0 || selectedStatuses.has(item.status);
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) =>
			sort === "asc"
				? a.variant.product.name.localeCompare(b.variant.product.name)
				: b.variant.product.name.localeCompare(a.variant.product.name),
		);

	if (items.length === 0) return <ItemsEmpty />;

	return (
		<ul className="faded-bottom no-scrollbar grid gap-5 overflow-auto pt-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</ul>
	);
}

export function ItemsList({ searchTerm, sort, selectedStatuses }: Props) {
	return (
		<Suspense fallback={<ItemsListSkeleton />}>
			<ItemsListInner
				searchTerm={searchTerm}
				sort={sort}
				selectedStatuses={selectedStatuses}
			/>
		</Suspense>
	);
}
