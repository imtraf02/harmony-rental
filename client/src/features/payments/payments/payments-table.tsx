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
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	paymentsColumns as columns,
	type PaymentHistoryRow,
} from "./payments-columns";

interface PaymentsTableProps {
	data: PaymentHistoryRow[];
	totalCount: number;
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	onPaginationChange: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	search: string;
	onSearchChange: (search: string) => void;
	isPending?: boolean;
}

export function PaymentsTable({
	data,
	totalCount,
	pagination,
	onPaginationChange,
	search,
	onSearchChange,
	isPending,
}: PaymentsTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			pagination,
		},
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
		manualSorting: true,
		rowCount: totalCount,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<TooltipProvider>
			<div
				className={cn("flex flex-1 flex-col gap-4", isPending && "opacity-90")}
			>
				<DataTableToolbar
					table={table}
					searchPlaceholder="Tìm theo mã đơn, khách hàng, phương thức..."
					searchValue={search}
					onSearchChange={onSearchChange}
					onReset={() => onSearchChange("")}
				/>
				<div className="relative overflow-hidden rounded-md border">
					{isPending && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
							<div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 shadow-sm">
								<Skeleton className="h-2 w-2 rounded-full" />
								<Skeleton className="h-2 w-8 rounded-full" />
								<Skeleton className="h-2 w-2 rounded-full" />
							</div>
						</div>
					)}
					<Table
						className={cn("transition-opacity", isPending && "opacity-50")}
					>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="hover:bg-transparent">
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											className="h-10 bg-muted/50 px-4 font-bold text-foreground"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="transition-colors hover:bg-muted/30"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="px-4 py-3">
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
										Không có giao dịch phù hợp.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<DataTablePagination table={table} className="mt-auto" />
			</div>
		</TooltipProvider>
	);
}

export type { PaymentHistoryRow };
