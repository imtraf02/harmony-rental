import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
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
import type { CustomerFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { CustomersBulkActions } from "./customers-bulk-actions";
import { customersColumns as columns } from "./customers-columns";

interface DataTableProps {
	data: CustomerFragment[];
}

export function CustomersTable({ data }: DataTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [globalFilter, onGlobalFilterChange] = useState("");
	const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>(
		[],
	);
	const [pagination, onPaginationChange] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			globalFilter,
			pagination,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange,
		onGlobalFilterChange,
		onColumnFiltersChange,
		globalFilterFn: (row, _columnId, filterValue) => {
			const name = String(row.getValue("name") || "").toLowerCase();
			const phone = String(row.getValue("phone") || "").toLowerCase();
			const searchValue = String(filterValue).toLowerCase();

			return name.includes(searchValue) || phone.includes(searchValue);
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
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
					searchPlaceholder="Tìm tên khách hàng hoặc số điện thoại..."
				/>
				<div className="overflow-hidden rounded-md border">
					<Table className="min-w-xl">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
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
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
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
										className="h-24 text-center"
									>
										Không tìm thấy dữ liệu.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<DataTablePagination table={table} className="mt-auto" />
				<CustomersBulkActions table={table} />
			</div>
		</TooltipProvider>
	);
}
