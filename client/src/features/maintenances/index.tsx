import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import { IconChecklist, IconSearch, IconTool } from "@tabler/icons-react";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemsQuery, updateItem } from "@/features/items/graphql";
import type { ItemFragment } from "@/gql/graphql";
import { ItemStatus } from "@/gql/graphql";

function formatDateTime(value: string) {
	return new Date(value).toLocaleString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

type SortValue = "updatedDesc" | "updatedAsc" | "codeAsc";

const sortItems: Array<{ label: string; value: SortValue }> = [
	{ label: "Mới cập nhật", value: "updatedDesc" },
	{ label: "Cũ nhất", value: "updatedAsc" },
	{ label: "Mã A → Z", value: "codeAsc" },
];

function MaintenancesContent() {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<SortValue>("updatedDesc");
	const [selectedItem, setSelectedItem] = useState<ItemFragment | null>(null);
	const [noteDialogOpen, setNoteDialogOpen] = useState(false);
	const [noteValue, setNoteValue] = useState("");
	const [confirmItem, setConfirmItem] = useState<ItemFragment | null>(null);

	const { data } = useSuspenseQuery(itemsQuery);
	const [mutate, { loading }] = useMutation(updateItem, {
		refetchQueries: [itemsQuery],
	});

	const maintenanceItems = useMemo(() => {
		const term = search.trim().toLowerCase();
		const base = (data?.items ?? []).filter(
			(item) => item.status === ItemStatus.Maintenance,
		);
		const filtered = base.filter((item) => {
			if (!term) return true;
			const productName = item.variant.product.name.toLowerCase();
			const variantText =
				`${item.variant.color} ${item.variant.size}`.toLowerCase();
			return (
				item.code.toLowerCase().includes(term) ||
				productName.includes(term) ||
				variantText.includes(term) ||
				item.note.toLowerCase().includes(term)
			);
		});
		return filtered.sort((a, b) => {
			if (sort === "updatedAsc") {
				return (
					new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
				);
			}
			if (sort === "codeAsc") {
				return a.code.localeCompare(b.code);
			}
			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
		});
	}, [data?.items, search, sort]);

	const totalMaintenance = maintenanceItems.length;
	const noNoteCount = maintenanceItems.filter(
		(item) => !item.note || item.note.trim().length === 0,
	).length;
	const updatedTodayCount = maintenanceItems.filter((item) => {
		const itemDate = new Date(item.updatedAt);
		const now = new Date();
		return (
			itemDate.getFullYear() === now.getFullYear() &&
			itemDate.getMonth() === now.getMonth() &&
			itemDate.getDate() === now.getDate()
		);
	}).length;

	const openNoteDialog = (item: ItemFragment) => {
		setSelectedItem(item);
		setNoteValue(item.note ?? "");
		setNoteDialogOpen(true);
	};

	const saveNote = async () => {
		if (!selectedItem) return;
		try {
			await mutate({
				variables: {
					id: selectedItem.id,
					input: {
						note: noteValue.trim(),
					},
				},
			});
			toast.success("Đã cập nhật ghi chú bảo trì.");
			setNoteDialogOpen(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Không thể lưu ghi chú.",
			);
		}
	};

	const completeMaintenance = async () => {
		if (!confirmItem) return;
		const completionNote = `Hoàn tất bảo trì lúc ${formatDateTime(new Date().toISOString())}`;
		const mergedNote = confirmItem.note?.trim()
			? `${confirmItem.note.trim()}\n${completionNote}`
			: completionNote;
		try {
			await mutate({
				variables: {
					id: confirmItem.id,
					input: {
						status: ItemStatus.Available,
						note: mergedNote,
					},
				},
			});
			toast.success(`Đã chuyển ${confirmItem.code} về trạng thái sẵn sàng.`);
			setConfirmItem(null);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Không thể hoàn tất bảo trì sản phẩm.",
			);
		}
	};

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Đang bảo trì
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalMaintenance}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Thiếu ghi chú
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{noNoteCount}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Cập nhật hôm nay
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{updatedTodayCount}</p>
					</CardContent>
				</Card>
			</div>

			<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-sm">
					<IconSearch className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Tìm mã, sản phẩm, màu/size, ghi chú..."
						className="pl-9"
					/>
				</div>
				<Select
					items={sortItems}
					value={sort}
					onValueChange={(value) => {
						if (value) setSort(value as SortValue);
					}}
				>
					<SelectTrigger className="w-full sm:w-44" aria-label="Sắp xếp">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{sortItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<div className="mt-4 grid gap-3">
				{maintenanceItems.length === 0 && (
					<Card>
						<CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
							<IconTool className="size-8 opacity-50" />
							<p>Không có sản phẩm nào đang bảo trì.</p>
						</CardContent>
					</Card>
				)}

				{maintenanceItems.map((item) => (
					<Card key={item.id}>
						<CardContent className="p-4">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<p className="font-mono text-sm font-semibold">
											{item.code}
										</p>
										<Badge variant="outline">Bảo trì</Badge>
									</div>
									<p className="text-sm font-medium">
										{item.variant.product.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{item.variant.color || "Không màu"} · Size{" "}
										{item.variant.size || "Free"}
									</p>
									<p className="text-xs text-muted-foreground">
										Cập nhật: {formatDateTime(item.updatedAt)}
									</p>
									<p className="text-sm text-foreground">
										{item.note?.trim() || "Chưa có ghi chú bảo trì."}
									</p>
								</div>
								<div className="flex gap-2 self-end sm:self-start">
									<Button
										variant="outline"
										size="sm"
										onClick={() => openNoteDialog(item)}
									>
										Ghi chú
									</Button>
									<Button
										size="sm"
										onClick={() => setConfirmItem(item)}
										className="gap-1"
									>
										<IconChecklist className="size-4" />
										Hoàn tất
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cập nhật ghi chú bảo trì</DialogTitle>
						<DialogDescription>
							{selectedItem
								? `Sản phẩm: ${selectedItem.code} - ${selectedItem.variant.product.name}`
								: ""}
						</DialogDescription>
					</DialogHeader>
					<Textarea
						value={noteValue}
						onChange={(event) => setNoteValue(event.target.value)}
						rows={5}
						placeholder="Nhập chi tiết tình trạng, phương án xử lý..."
					/>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setNoteDialogOpen(false)}
						>
							Hủy
						</Button>
						<Button type="button" onClick={saveNote} disabled={loading}>
							{loading ? "Đang lưu..." : "Lưu ghi chú"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ConfirmDialog
				open={Boolean(confirmItem)}
				onOpenChange={(open) => {
					if (!open) setConfirmItem(null);
				}}
				title="Xác nhận hoàn tất bảo trì"
				desc={
					confirmItem
						? `Chuyển ${confirmItem.code} về trạng thái sẵn sàng để cho thuê lại?`
						: ""
				}
				confirmText="Xác nhận hoàn tất"
				handleConfirm={() => {
					void completeMaintenance();
				}}
				isLoading={loading}
			/>
		</>
	);
}

export function Maintenances() {
	return (
		<>
			<Header />
			<Main>
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Bảo trì / Giặt ủi
					</h1>
					<p className="text-muted-foreground">
						Theo dõi các sản phẩm đang bảo trì và xác nhận hoàn tất để đưa về
						kho sẵn sàng.
					</p>
				</div>
				<div className="mt-4">
					<Suspense
						fallback={
							<p className="text-sm text-muted-foreground">
								Đang tải dữ liệu bảo trì...
							</p>
						}
					>
						<MaintenancesContent />
					</Suspense>
				</div>
			</Main>
		</>
	);
}
