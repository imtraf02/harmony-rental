import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DataTableViewOptionsProps<TData> = {
	table: Table<TData>;
	labels?: Record<string, string>;
};

export function DataTableViewOptions<TData>({
	table,
	labels,
}: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="ms-auto hidden h-8 lg:flex"
					>
						<IconAdjustmentsHorizontal className="size-4" />
						Hiển thị
					</Button>
				}
			></DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Bật/tắt cột</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{table
						.getAllColumns()
						.filter(
							(column) =>
								typeof column.accessorFn !== "undefined" && column.getCanHide(),
						)
						.map((column) => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{labels?.[column.id] ||
										(typeof column.columnDef.header === "string"
											? column.columnDef.header
											: column.id)}
								</DropdownMenuCheckboxItem>
							);
						})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
