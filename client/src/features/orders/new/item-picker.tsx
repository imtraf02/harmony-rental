import { useSuspenseQuery } from "@apollo/client/react";
import { IconSearch } from "@tabler/icons-react";
import { Suspense, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesSelect } from "@/features/categories/components/categories-select";
import { itemsQuery } from "@/features/items/graphql";
import type { ItemFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface ItemPickerProps {
	selectedItems: ItemFragment[];
	onItemsSelect: (items: ItemFragment[]) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);
}

function ItemPickerContent({
	selectedItems,
	onItemsSelect,
	onClose,
}: Omit<ItemPickerProps, "open" | "onOpenChange"> & { onClose: () => void }) {
	const { data } = useSuspenseQuery(itemsQuery);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryId, setCategoryId] = useState<string>("all");
	const [tempSelected, setTempSelected] =
		useState<ItemFragment[]>(selectedItems);

	const groupedItems = useMemo(() => {
		const allItems = data?.items || [];
		const filtered = allItems.filter((item) => {
			const matchesSearch =
				item.variant.product.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				item.code.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				categoryId === "all" || item.variant.product.categoryId === categoryId;
			return matchesSearch && matchesCategory;
		});

		const groups: Record<
			string,
			{
				variant: ItemFragment["variant"];
				items: ItemFragment[];
				selectedCount: number;
			}
		> = {};

		for (const item of filtered) {
			if (!groups[item.variantId]) {
				groups[item.variantId] = {
					variant: item.variant,
					items: [],
					selectedCount: 0,
				};
			}
			groups[item.variantId].items.push(item);
		}

		// Update selectedCount based on tempSelected
		for (const selected of tempSelected) {
			if (groups[selected.variantId]) {
				groups[selected.variantId].selectedCount++;
			}
		}

		return Object.values(groups);
	}, [data?.items, searchTerm, categoryId, tempSelected]);

	const updateVariantQuantity = (variantId: string, newQty: number) => {
		const variantGroup = groupedItems.find((g) => g.variant.id === variantId);
		if (!variantGroup) return;

		const currentSelectedForVariant = tempSelected.filter(
			(i) => i.variantId === variantId,
		);
		const currentQty = currentSelectedForVariant.length;

		if (newQty > currentQty) {
			// Add more items (ONLY AVAILABLE ones)
			const availableToAdd = variantGroup.items.filter(
				(item) =>
					!tempSelected.some((s) => s.id === item.id) &&
					item.status === "AVAILABLE",
			);

			const toAddList = availableToAdd.slice(0, newQty - currentQty);
			setTempSelected((prev) => [...prev, ...toAddList]);
		} else if (newQty < currentQty) {
			// Remove items
			const toKeep = currentSelectedForVariant.slice(0, newQty);
			setTempSelected((prev) => [
				...prev.filter((i) => i.variantId !== variantId),
				...toKeep,
			]);
		}
	};

	const toggleItem = (item: ItemFragment) => {
		setTempSelected((prev) => {
			const exists = prev.find((i) => i.id === item.id);
			if (exists) {
				return prev.filter((i) => i.id !== item.id);
			}
			if (item.status !== "AVAILABLE") return prev;
			return [...prev, item];
		});
	};

	const handleSave = () => {
		onItemsSelect(tempSelected);
		onClose();
	};

	return (
		<>
			<div className="flex flex-col sm:flex-row gap-2 mb-4 px-1">
				<InputGroup className="flex-1">
					<InputGroupAddon>
						<IconSearch className="size-4" />
					</InputGroupAddon>
					<InputGroupInput
						placeholder="Tìm kiếm sản phẩm hoặc mã..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</InputGroup>
				<div className="w-full sm:w-48">
					<CategoriesSelect
						value={categoryId}
						onValueChange={setCategoryId}
						placeholder="Tất cả"
					/>
				</div>
			</div>

			<ScrollArea className="h-114 pr-4">
				<div className="flex flex-col gap-3">
					{groupedItems.map(({ variant, items, selectedCount }) => {
						const imageUrl = variant.imageUrl
							? variant.imageUrl.startsWith("http")
								? variant.imageUrl
								: `http://localhost:4000${variant.imageUrl}`
							: null;
						const availableCount = items.filter(
							(i) => i.status === "AVAILABLE",
						).length;

						return (
							<div
								key={variant.id}
								className={cn(
									"flex gap-4 p-4 border rounded-xl transition-all",
									selectedCount > 0
										? "border-primary bg-primary/5 shadow-sm"
										: "hover:bg-muted/50",
								)}
							>
								<div className="size-16 bg-muted rounded-lg overflow-hidden shrink-0 border">
									{imageUrl ? (
										<img
											src={imageUrl}
											alt={variant.product.name}
											className="w-full h-full object-cover"
										/>
									) : null}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2">
										<div>
											<p className="font-bold text-base">
												{variant.product.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{variant.color}{" "}
												{variant.size && `• Size ${variant.size}`}
											</p>
										</div>
										<p className="font-black text-primary">
											{formatCurrency(variant.rentalPrice)}
										</p>
									</div>

									<div className="flex items-end justify-between mt-3">
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-2">
												<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
													Kho:
												</span>
												<Badge
													variant="outline"
													className={cn(
														"text-[10px] px-1.5 h-5",
														availableCount > 0
															? "bg-green-500/10 text-green-600 border-green-200"
															: "bg-red-500/10 text-red-600 border-red-200",
													)}
												>
													{availableCount} sẵn sàng / {items.length} món
												</Badge>
											</div>
											<div className="flex flex-wrap gap-1 mt-1">
												{items.slice(0, 5).map((item) => {
													const isSelected = tempSelected.some(
														(s) => s.id === item.id,
													);
													return (
														<Badge
															key={item.id}
															variant={isSelected ? "default" : "secondary"}
															className={cn(
																"text-[9px] px-1 h-4 font-mono cursor-pointer",
																!isSelected &&
																	item.status !== "AVAILABLE" &&
																	"opacity-50",
															)}
															onClick={() => toggleItem(item)}
														>
															{item.code}
														</Badge>
													);
												})}
												{items.length > 5 && (
													<span className="text-[9px] text-muted-foreground font-medium pt-0.5">
														+{items.length - 5}
													</span>
												)}
											</div>
										</div>

										<div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-sm">
											<Button
												variant="ghost"
												size="icon"
												className="size-7 rounded-md"
												onClick={() =>
													updateVariantQuantity(
														variant.id,
														Math.max(0, selectedCount - 1),
													)
												}
												disabled={selectedCount === 0}
											>
												-
											</Button>
											<div className="w-8 text-center font-bold text-sm">
												{selectedCount}
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="size-7 rounded-md"
												onClick={() =>
													updateVariantQuantity(
														variant.id,
														Math.min(availableCount, selectedCount + 1),
													)
												}
												disabled={selectedCount >= availableCount}
											>
												+
											</Button>
										</div>
									</div>
								</div>
							</div>
						);
					})}
					{groupedItems.length === 0 && (
						<div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
							<p className="text-muted-foreground">
								Không tìm thấy sản phẩm nào
							</p>
						</div>
					)}
				</div>
			</ScrollArea>

			<div className="flex justify-between items-center mt-6">
				<p className="text-sm text-muted-foreground">
					Đã chọn <strong>{tempSelected.length}</strong> sản phẩm
				</p>
				<div className="flex gap-2">
					<Button variant="outline" onClick={onClose}>
						Hủy
					</Button>
					<Button onClick={handleSave}>Xác nhận</Button>
				</div>
			</div>
		</>
	);
}

export function ItemPicker({ open, onOpenChange, ...props }: ItemPickerProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Chọn sản phẩm</DialogTitle>
					<DialogDescription>
						Tìm kiếm và chọn các sản phẩm cho đơn thuê.
					</DialogDescription>
				</DialogHeader>
				<Suspense
					fallback={
						<div className="flex flex-col gap-2 py-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-[400px] w-full" />
						</div>
					}
				>
					<ItemPickerContent onClose={() => onOpenChange(false)} {...props} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
