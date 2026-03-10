import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table";

type CustomersBulkActionsProps<TData> = {
	table: Table<TData>;
};

export function CustomersBulkActions<TData>({
	table,
}: CustomersBulkActionsProps<TData>) {
	// const selectedRows = table.getFilteredSelectedRowModel().rows;

	return (
		<>
			<BulkActionsToolbar table={table} entityName="khách hàng">
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="destructive"
								size="icon"
								onClick={() => {
									// setShowDeleteConfirm(true)
								}}
								className="size-8"
								aria-label="Xóa khách hàng đã chọn"
								title="Xóa khách hàng đã chọn"
							>
								<Trash2 className="size-4" />
								<span className="sr-only">Xóa khách hàng đã chọn</span>
							</Button>
						}
					/>
					<TooltipContent>
						<p>Xóa khách hàng đã chọn</p>
					</TooltipContent>
				</Tooltip>
			</BulkActionsToolbar>

			{/* Placeholder for CustomersMultiDeleteDialog */}
			{/* <CustomersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      /> */}
		</>
	);
}
