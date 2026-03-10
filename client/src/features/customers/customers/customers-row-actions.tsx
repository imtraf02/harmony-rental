import { MoreHorizontal, Trash2, UserPen } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CustomerFragment } from "@/gql/graphql";
import { useCustomers } from "../common/customers-provider";

type DataTableRowActionsProps = {
	row: Row<CustomerFragment>;
};

export function CustomersRowActions({ row }: DataTableRowActionsProps) {
	const { setOpen, setCurrentRow } = useCustomers();
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Mở menu</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem
					onClick={() => {
						setCurrentRow(row.original);
						setOpen("update");
					}}
				>
					Chỉnh sửa
					<DropdownMenuShortcut>
						<UserPen className="size-4" />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						setCurrentRow(row.original);
						setOpen("delete");
					}}
					className="text-destructive focus:text-destructive"
				>
					Xóa
					<DropdownMenuShortcut>
						<Trash2 className="size-4" />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
