import { IconX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";

type DataTableToolbarProps<TData> = {
	table: Table<TData>;
	searchPlaceholder?: string;
	searchKey?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onReset?: () => void;
	filters?: {
		columnId: string;
		title: string;
		options: {
			label: string;
			value: string;
			icon?: React.ComponentType<{ className?: string }>;
		}[];
		value?: unknown[];
		onChange?: (value: unknown[]) => void;
	}[];
	columnLabels?: Record<string, string>;
};

export function DataTableToolbar<TData>({
	table,
	searchPlaceholder = "Chọn lọc...",
	searchKey,
	searchValue,
	onSearchChange,
	onReset,
	filters = [],
	columnLabels,
}: DataTableToolbarProps<TData>) {
	const isFiltered =
		table.getState().columnFilters.length > 0 ||
		table.getState().globalFilter ||
		searchValue ||
		filters.some((f) => f.value && f.value.length > 0);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
				{onSearchChange ? (
					<Input
						placeholder={searchPlaceholder}
						value={searchValue ?? ""}
						onChange={(event) => onSearchChange(event.target.value)}
						className="h-8 w-40 lg:w-64"
					/>
				) : searchKey ? (
					<Input
						placeholder={searchPlaceholder}
						value={
							(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(searchKey)?.setFilterValue(event.target.value)
						}
						className="h-8 w-40 lg:w-64"
					/>
				) : (
					<Input
						placeholder={searchPlaceholder}
						value={table.getState().globalFilter ?? ""}
						onChange={(event) => table.setGlobalFilter(event.target.value)}
						className="h-8 w-40 lg:w-64"
					/>
				)}
				<div className="flex gap-x-2">
					{filters.map((filter) => {
						const column = table.getColumn(filter.columnId);
						if (!column) return null;
						return (
							<DataTableFacetedFilter
								key={filter.columnId}
								column={column}
								title={filter.title}
								options={filter.options}
								value={filter.value}
								onChange={filter.onChange}
							/>
						);
					})}
				</div>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => {
							if (onReset) {
								onReset();
							} else {
								table.resetColumnFilters();
								table.setGlobalFilter("");
							}
						}}
						className="h-8 px-2 lg:px-3"
					>
						Đặt lại
						<IconX className="ms-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} labels={columnLabels} />
		</div>
	);
}
