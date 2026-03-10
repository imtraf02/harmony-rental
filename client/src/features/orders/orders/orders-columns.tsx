import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { differenceInDays, format, isBefore, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { OrderFragment } from "@/gql/graphql";
import { OrderStatus, type PaymentStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import {
	getOrderStatusConfig,
	getPaymentStatusConfig,
} from "../constants/status";
import { OrderRowActions } from "./order-row-actions";

export {
	getOrderStatusConfig,
	getPaymentStatusConfig,
} from "../constants/status";

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
};

export const ordersColumns: ColumnDef<OrderFragment>[] = [
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
		accessorKey: "code",
		header: "Mã đơn",
		cell: ({ row }) => (
			<Link
				to="/orders/$id"
				params={{ id: row.original.id }}
				className="font-medium font-mono text-primary hover:underline transition-colors"
			>
				{row.getValue("code")}
			</Link>
		),
	},
	{
		accessorKey: "customer.name",
		id: "customer",
		header: "Khách hàng",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<Link
					to="/orders/$id"
					params={{ id: row.original.id }}
					className="font-medium hover:underline transition-colors"
				>
					{row.original.customer.name}
				</Link>
				<span className="text-xs text-muted-foreground">
					{row.original.customer.phone}
				</span>
			</div>
		),
	},
	{
		accessorKey: "rentalDate",
		header: "Ngày thuê",
		cell: ({ row }) => {
			const date = new Date(row.getValue("rentalDate"));
			return <div>{format(date, "dd/MM/yyyy", { locale: vi })}</div>;
		},
	},
	{
		accessorKey: "returnDate",
		header: "Hẹn trả",
		cell: ({ row }) => {
			const returnDate = new Date(row.getValue("returnDate"));
			const status = row.original.status;
			const now = new Date();

			const isReturned = status === OrderStatus.Returned;
			const isOverdue =
				!isReturned && isBefore(startOfDay(returnDate), startOfDay(now));
			const diffDays = differenceInDays(
				startOfDay(returnDate),
				startOfDay(now),
			);
			const isUpcoming = !isReturned && !isOverdue && diffDays <= 2;

			return (
				<div className="flex flex-col gap-1">
					<div
						className={cn(
							"flex items-center gap-1.5 font-medium",
							isOverdue && "text-red-500",
							isUpcoming && "text-amber-500",
						)}
					>
						{isOverdue && <IconAlertTriangle className="size-3.5" />}
						{isUpcoming && <IconAlertTriangle className="size-3.5" />}
						{format(returnDate, "dd/MM/yyyy", { locale: vi })}
					</div>
					{isOverdue && (
						<span className="text-[10px] font-bold text-red-500 uppercase">
							Quá hạn {Math.abs(diffDays)} ngày
						</span>
					)}
					{isUpcoming && (
						<span className="text-[10px] font-bold text-amber-500 uppercase">
							Còn {diffDays} ngày
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "returnedAt",
		header: "Ngày trả",
		cell: ({ row }) => {
			const returnedAt = row.getValue("returnedAt")
				? new Date(row.getValue("returnedAt") as string)
				: null;
			if (!returnedAt)
				return (
					<span className="text-muted-foreground text-xs italic">Chưa trả</span>
				);

			return (
				<div className="flex items-center gap-1.5 font-medium text-green-600">
					<IconCircleCheck className="size-3.5" />
					{format(returnedAt, "dd/MM/yyyy HH:mm", { locale: vi })}
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => {
			const status = row.getValue("status") as OrderStatus;
			const config = getOrderStatusConfig(status);
			return (
				<Badge variant="outline" className={config.className}>
					{config.label}
				</Badge>
			);
		},
		filterFn: (row, id, value: string[]) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "paymentStatus",
		header: "Thanh toán",
		cell: ({ row }) => {
			const status = row.getValue("paymentStatus") as PaymentStatus;
			const config = getPaymentStatusConfig(status);
			return (
				<Badge variant="outline" className={config.className}>
					{config.label}
				</Badge>
			);
		},
		filterFn: (row, id, value: string[]) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "totalAmount",
		header: "Tổng tiền",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("totalAmount"));
			const formatted = formatCurrency(amount);
			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <OrderRowActions row={row} />,
	},
];
