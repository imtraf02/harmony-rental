import { IconReceipt } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { OrderCollectPaymentDialog } from "../orders/order-collect-payment-dialog";
import { formatCurrency } from "../orders/orders-columns";

interface OrderPaymentPanelProps {
	order: OrderFragment;
}

export function OrderPaymentPanel({ order }: OrderPaymentPanelProps) {
	const [isCollectOpen, setIsCollectOpen] = useState(false);

	const totalWithFees =
		order.totalAmount + (order.lateFee || 0) + (order.damageFee || 0);

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between gap-2">
						<CardTitle className="flex items-center">
							<IconReceipt className="h-4 w-4 text-primary mr-2" />
							Thanh toán
						</CardTitle>
						<Button size="sm" onClick={() => setIsCollectOpen(true)}>
							Thu tiền
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2.5">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								Tổng tiền thuê
							</span>
							<span className="text-sm font-semibold text-foreground">
								{formatCurrency(order.totalAmount)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Phí quá hạn</span>
							<span className="text-sm font-semibold text-chart-5">
								{formatCurrency(order.lateFee || 0)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Phí hư hại</span>
							<span className="text-sm font-semibold text-destructive">
								{formatCurrency(order.damageFee || 0)}
							</span>
						</div>
					</div>

					<Separator className="my-3" />

					<div className="flex justify-between items-center mb-3">
						<span className="text-sm font-semibold text-foreground">
							Tổng cộng
						</span>
						<span className="text-base font-black text-primary">
							{formatCurrency(totalWithFees)}
						</span>
					</div>

					<div className="flex justify-between items-center mb-4">
						<span className="text-sm text-muted-foreground">
							Đã thanh toán / cọc
						</span>
						<span className="text-sm font-bold text-chart-2">
							{formatCurrency(order.depositPaid)}
						</span>
					</div>

					<div
						className={cn(
							"flex justify-between items-center rounded-lg px-4 py-3 border",
							order.balanceDue >= 0
								? "bg-primary/10 border-primary/30"
								: "bg-chart-2/10 border-chart-2/30",
						)}
					>
						<span
							className={cn(
								"text-sm font-bold",
								order.balanceDue >= 0 ? "text-primary" : "text-chart-2",
							)}
						>
							{order.balanceDue >= 0 ? "Cần thu thêm" : "Cần trả lại"}
						</span>
						<span
							className={cn(
								"text-xl font-black",
								order.balanceDue >= 0 ? "text-primary" : "text-chart-2",
							)}
						>
							{formatCurrency(Math.abs(order.balanceDue))}
						</span>
					</div>
				</CardContent>
			</Card>

			<OrderCollectPaymentDialog
				open={isCollectOpen}
				onOpenChange={setIsCollectOpen}
				currentRow={order}
			/>
		</>
	);
}
