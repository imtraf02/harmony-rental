import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getOrderStatusConfig } from "@/features/orders/constants/status";
import type { OrderStatus } from "@/gql/graphql";

type DueOrder = {
	id: string;
	code: string;
	customerName: string;
	customerPhone: string;
	returnDate: string;
	totalAmount: number;
	balanceDue: number;
	status: OrderStatus;
	daysToDue: number;
};

type ReturnsDeadlineCardsProps = {
	upcomingReturns: DueOrder[];
	overdueReturns: DueOrder[];
};

function formatVnd(value: number) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

function DueList({ data, overdue }: { data: DueOrder[]; overdue?: boolean }) {
	if (data.length === 0) {
		return (
			<p className="py-8 text-center text-sm text-muted-foreground">
				{overdue ? "Không có đơn quá hạn trả" : "Không có đơn sắp đến hạn trả"}
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{data.map((order) => (
				<Link
					key={order.id}
					to="/orders/$id"
					params={{ id: order.id }}
					className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
				>
					<div className="flex items-start justify-between gap-2">
						<div>
							<p className="font-medium">{order.code}</p>
							<p className="text-xs text-muted-foreground">
								{order.customerName} - {order.customerPhone}
							</p>
						</div>
						<Badge variant={overdue ? "destructive" : "outline"}>
							{overdue
								? `${Math.abs(order.daysToDue)} ngày trễ`
								: `${order.daysToDue} ngày nữa`}
						</Badge>
					</div>
					<div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
						<span>Hạn trả: {formatDate(order.returnDate)}</span>
						<span>Còn nợ: {formatVnd(order.balanceDue)}</span>
						<span>Tổng đơn: {formatVnd(order.totalAmount)}</span>
						<span>Trạng thái: {getOrderStatusConfig(order.status).label}</span>
					</div>
				</Link>
			))}
		</div>
	);
}

export function ReturnsDeadlineCards({
	upcomingReturns,
	overdueReturns,
}: ReturnsDeadlineCardsProps) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 items-start">
			<Card>
				<CardHeader>
					<CardTitle>Đơn sắp đến hạn trả</CardTitle>
					<CardDescription>Ưu tiên xử lý trong 7 ngày tới</CardDescription>
				</CardHeader>
				<CardContent>
					<DueList data={upcomingReturns} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Đơn quá hạn trả</CardTitle>
					<CardDescription>Cần liên hệ khách ngay</CardDescription>
				</CardHeader>
				<CardContent>
					<DueList data={overdueReturns} overdue />
				</CardContent>
			</Card>
		</div>
	);
}
