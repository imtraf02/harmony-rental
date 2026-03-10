import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { paymentMethodLabelMap } from "../constants/payment-methods";

export type PaymentHistoryRow = {
	id: string;
	amount: number;
	method: string;
	note: string;
	paidAt: string;
	order: {
		id: string;
		code: string;
		status: string;
		paymentStatus: string;
		balanceDue: number;
		totalAmount: number;
		customer: { name: string; phone: string };
	};
};

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(amount);
}

export const paymentsColumns: ColumnDef<PaymentHistoryRow>[] = [
	{
		accessorFn: (row) => row.order.code,
		id: "orderCode",
		header: "Mã đơn",
		cell: ({ row }) => (
			<Link
				to="/orders/$id"
				params={{ id: row.original.order.id }}
				className="font-mono text-primary hover:underline"
			>
				{row.original.order.code}
			</Link>
		),
	},
	{
		accessorFn: (row) => row.order.customer.name,
		id: "customer",
		header: "Khách hàng",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span>{row.original.order.customer.name}</span>
				<span className="text-xs text-muted-foreground">
					{row.original.order.customer.phone}
				</span>
			</div>
		),
	},
	{
		accessorKey: "paidAt",
		header: "Ngày thu",
		cell: ({ row }) =>
			format(new Date(row.original.paidAt), "dd/MM/yyyy HH:mm", { locale: vi }),
	},
	{
		accessorKey: "method",
		header: "Phương thức",
		cell: ({ row }) =>
			paymentMethodLabelMap[row.original.method] ?? row.original.method,
	},
	{
		accessorKey: "amount",
		header: "Số tiền",
		cell: ({ row }) => formatCurrency(row.original.amount),
	},
	{
		accessorKey: "note",
		header: "Ghi chú",
		cell: ({ row }) => row.original.note || "-",
	},
];
