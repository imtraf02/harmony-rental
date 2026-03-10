import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import type { CustomerFragment } from "@/gql/graphql";
import { CustomersRowActions } from "./customers-row-actions";

export const customersColumns: ColumnDef<CustomerFragment>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					((table.getIsSomePageRowsSelected() && "indeterminate") as boolean)
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-0.5"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-0.5"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Họ và tên",
		cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "phone",
		header: "Số điện thoại",
		cell: ({ row }) => <div>{row.getValue("phone")}</div>,
	},
	{
		accessorKey: "address",
		header: "Địa chỉ",
		cell: ({ row }) => (
			<div className="max-w-[300px] truncate" title={row.getValue("address")}>
				{row.getValue("address") || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
			</div>
		),
	},
	{
		accessorKey: "note",
		header: "Ghi chú",
		cell: ({ row }) => (
			<div className="max-w-[200px] truncate" title={row.getValue("note")}>
				{row.getValue("note") || <span className="text-muted-foreground italic">-</span>}
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Ngày tạo",
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return <div>{format(date, "dd/MM/yyyy", { locale: vi })}</div>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <CustomersRowActions row={row} />,
	},
];
