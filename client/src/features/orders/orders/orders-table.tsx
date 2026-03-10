import {
	flexRender,
	getCoreRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "@/components/data-table/pagination";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderFragment } from "@/gql/graphql";
import { OrderStatus, PaymentStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import {
	ordersColumns as columns,
	getOrderStatusConfig,
	getPaymentStatusConfig,
} from "./orders-columns";
import { OrdersBulkActions } from "./orders-bulk-actions";

const orderStatusOptions = Object.values(OrderStatus).map((status) => ({
	label: getOrderStatusConfig(status).label,
	value: status,
}));

const paymentStatusOptions = Object.values(PaymentStatus).map((status) => ({
	label: getPaymentStatusConfig(status).label,
	value: status,
}));

interface DataTableProps {
	data: OrderFragment[];
	totalCount: number;
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
	search: string;
	onSearchChange: (search: string) => void;
	statuses: OrderStatus[];
	onStatusesChange: (statuses: OrderStatus[]) => void;
	paymentStatuses: PaymentStatus[];
	onPaymentStatusesChange: (statuses: PaymentStatus[]) => void;
	isPending?: boolean;
}

export function OrdersTable({
	data,
	totalCount,
	pagination,
	onPaginationChange,
	search,
	onSearchChange,
	statuses,
	onStatusesChange,
	paymentStatuses,
	onPaymentStatusesChange,
	isPending,
}: DataTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			pagination,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				onPaginationChange(updater(pagination));
			} else {
				onPaginationChange(updater);
			}
		},
		manualPagination: true,
		manualFiltering: true,
		manualSorting: true,
		rowCount: totalCount,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<TooltipProvider>
			<div
				className={cn(
					'max-sm:has-[div[role="toolbar"]]:mb-16',
					"flex flex-1 flex-col gap-4",
				)}
			>
				<DataTableToolbar
					table={table}
					searchPlaceholder="Tìm mã đơn hoặc khách hàng..."
					searchValue={search}
					onSearchChange={onSearchChange}
					onReset={() => {
						onSearchChange("");
						onStatusesChange([]);
						onPaymentStatusesChange([]);
					}}
					filters={[
						{
							columnId: "status",
							title: "Trạng thái",
							options: orderStatusOptions,
							value: statuses,
							onChange: (val) => onStatusesChange(val as OrderStatus[]),
						},
						{
							columnId: "paymentStatus",
							title: "Thanh toán",
							options: paymentStatusOptions,
							value: paymentStatuses,
							onChange: (val) => onPaymentStatusesChange(val as PaymentStatus[]),
						},
					]}
				/>
				<div className="overflow-hidden rounded-md border relative">
					{isPending && (
						<div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[1px]">
							<div className="flex flex-col items-center gap-3 px-6 py-4 rounded-xl border bg-background shadow-xl animate-in fade-in zoom-in duration-300">
								<div className="flex gap-1.5">
									<Skeleton className="h-2 w-2 rounded-full" />
									<Skeleton className="h-2 w-10 rounded-full" />
									<Skeleton className="h-2 w-6 rounded-full" />
								</div>
								<span className="text-[10px] font-bold tracking-widest text-primary uppercase">Syncing...</span>
							</div>
						</div>
					)}
					<Table className={cn("min-w-xl transition-opacity duration-300", isPending && "opacity-40 select-none pointer-events-none")}>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="group/row hover:bg-transparent">
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}
												className={cn(
													"bg-muted/50 font-bold text-foreground h-10 px-4",
													// @ts-expect-error
													header.column.columnDef.meta?.className,
													// @ts-expect-error
													header.column.columnDef.meta?.thClassName,
												)}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className="group/row transition-colors hover:bg-muted/30"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className={cn(
													"px-4 py-3",
													// @ts-expect-error
													cell.column.columnDef.meta?.className,
													// @ts-expect-error
													cell.column.columnDef.meta?.tdClassName,
												)}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-muted-foreground"
									>
										Không tìm thấy đơn hàng nào.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<DataTablePagination table={table} className="mt-auto" />
				<OrdersBulkActions table={table} />
			</div>
		</TooltipProvider>
	);
}
