import { gql } from "@apollo/client";
import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatDate, formatVnd } from "@/lib/format";
import { toast } from "sonner";
import { DatePickerField } from "@/components/date-picker-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getOrderStatusConfig,
	getPaymentStatusConfig,
} from "@/features/orders/constants/status";
import {
	ordersQuery,
	updateOrder,
	updateOrderStatus,
} from "@/features/orders/graphql";
import {
	paymentMethodItems,
	paymentMethodLabelMap,
} from "@/features/payments/constants/payment-methods";
import { PAYMENT_HISTORY_QUERY } from "@/features/payments/graphql/queries";
import { OrderStatus, PaymentStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";

type ProductRelatedOrder = {
	id: string;
	code: string;
	rentalDate: string;
	returnDate: string;
	totalAmount: number;
	balanceDue: number;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	customer: {
		name: string;
		phone: string;
	};
};

type ProductRelatedOrdersResponse = {
	ordersByProduct: ProductRelatedOrder[];
	ordersByProductCount: number;
};

const PRODUCT_RELATED_ORDERS_QUERY = gql`
	query ProductRelatedOrders($productId: String!, $page: Int, $pageSize: Int) {
		ordersByProduct(productId: $productId, page: $page, pageSize: $pageSize) {
			id
			code
			rentalDate
			returnDate
			totalAmount
			balanceDue
			status
			paymentStatus
			customer {
				name
				phone
			}
		}
		ordersByProductCount(productId: $productId)
	}
`;

const RECORD_ORDER_PAYMENT = gql`
	mutation RecordOrderPayment($input: RecordOrderPaymentInput!) {
		recordOrderPayment(input: $input) {
			id
			depositPaid
			balanceDue
			paymentStatus
		}
	}
`;

const statusItems: Array<{
	label: string;
	value: OrderStatus;
}> = Object.values(OrderStatus).map((status) => ({
	label: getOrderStatusConfig(status).label,
	value: status,
}));
const MIN_NOTE_LENGTH = 10;



type CollectPaymentDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	order: ProductRelatedOrder | null;
	onSuccess: () => void;
};

function CollectPaymentDialog({
	open,
	onOpenChange,
	order,
	onSuccess,
}: CollectPaymentDialogProps) {
	const dueAmount = useMemo(() => Math.max(order?.balanceDue ?? 0, 0), [order]);
	const refundableAmount = useMemo(
		() => Math.max(-(order?.balanceDue ?? 0), 0),
		[order],
	);
	const [amountInput, setAmountInput] = useState("");
	const [method, setMethod] = useState(paymentMethodItems[0]?.value ?? "CASH");
	const [note, setNote] = useState("");
	const [paidAt, setPaidAt] = useState<string | null>(null);
	const [nextStatus, setNextStatus] = useState<OrderStatus>(
		OrderStatus.Pending,
	);

	const [recordPayment, { loading }] = useMutation(RECORD_ORDER_PAYMENT, {
		refetchQueries: [{ query: ordersQuery }, { query: PAYMENT_HISTORY_QUERY }],
	});
	const [updateStatus, { loading: statusUpdating }] = useMutation(
		updateOrderStatus,
		{
			refetchQueries: [{ query: ordersQuery }],
		},
	);
	const [updateOrderInfo, { loading: orderUpdating }] = useMutation(
		updateOrder,
		{
			refetchQueries: [{ query: ordersQuery }],
		},
	);

	const parsedAmount = Number(amountInput || 0);
	const isSettledAmount = dueAmount === 0 && refundableAmount === 0;
	const isInvalidAmount =
		isSettledAmount || refundableAmount > 0
			? false
			: !Number.isFinite(parsedAmount) || parsedAmount <= 0;
	const submitAmount = refundableAmount > 0 ? -refundableAmount : parsedAmount;
	const normalizedNote = note.trim();

	const handleSubmit = async () => {
		if (!order) return;
		if (normalizedNote.length < MIN_NOTE_LENGTH) {
			toast.error("Vui lòng nhập ghi chú đầy đủ (ít nhất 10 ký tự).");
			return;
		}
		if (isInvalidAmount) {
			toast.error("Số tiền thu không hợp lệ.");
			return;
		}
		if (!isSettledAmount && refundableAmount <= 0 && parsedAmount > dueAmount) {
			toast.error("Số tiền thu không được vượt số nợ hiện tại.");
			return;
		}

		try {
			if (!isSettledAmount) {
				await recordPayment({
					variables: {
						input: {
							orderId: order.id,
							amount: submitAmount,
							method: paymentMethodLabelMap[method] ?? method,
							note: normalizedNote,
							paidAt: paidAt
								? new Date(`${paidAt}T00:00:00`).toISOString()
								: undefined,
						},
					},
				});
			} else {
				await updateOrderInfo({
					variables: {
						id: order.id,
						input: {
							note: normalizedNote,
						},
					},
				});
			}
			if (nextStatus !== order.status) {
				await updateStatus({
					variables: {
						id: order.id,
						status: nextStatus,
					},
				});
			}
			toast.success(
				isSettledAmount
					? "Đã xác nhận thanh toán."
					: refundableAmount > 0
						? "Đã hoàn cọc dư và cập nhật thanh toán."
						: "Đã ghi nhận thanh toán.",
			);
			onSuccess();
			onOpenChange(false);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Không thể ghi nhận thanh toán.",
			);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (nextOpen) {
					setAmountInput(String(dueAmount || ""));
					setMethod(paymentMethodItems[0]?.value ?? "CASH");
					setNote("");
					setPaidAt(null);
					setNextStatus(order?.status ?? OrderStatus.Pending);
				}
				onOpenChange(nextOpen);
			}}
		>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Thu tiền đơn {order?.code ?? ""}</DialogTitle>
					<DialogDescription>
						{refundableAmount > 0 ? (
							<>
								Khách: {order?.customer.name ?? "-"} • Hoàn cọc dư:{" "}
								{formatVnd(refundableAmount)}
							</>
						) : isSettledAmount ? (
							<>
								Khách: {order?.customer.name ?? "-"} • Đơn đã cân bằng công nợ
								(0đ), bấm để xác nhận thanh toán.
							</>
						) : (
							<>
								Khách: {order?.customer.name ?? "-"} • Còn nợ:{" "}
								{formatVnd(dueAmount)}
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 gap-3 py-2">
					<div className="grid gap-1.5">
						<label htmlFor="p-amount-input" className="text-sm font-medium">
							{refundableAmount > 0
								? "Số tiền hoàn"
								: isSettledAmount
									? "Số tiền xác nhận"
									: "Số tiền thu"}
						</label>
						{refundableAmount > 0 ? (
							<div className="rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
								{formatVnd(refundableAmount)}
							</div>
						) : isSettledAmount ? (
							<div className="rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
								{formatVnd(0)}
							</div>
						) : (
							<>
								<Input
									id="p-amount-input"
									type="number"
									min={1}
									step={1000}
									value={amountInput}
									onChange={(event) => setAmountInput(event.target.value)}
									placeholder="Nhập số tiền"
								/>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setAmountInput(String(dueAmount || ""))}
									>
										Thu đủ
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											setAmountInput(
												String(Math.max(Math.floor(dueAmount / 2), 1)),
											)
										}
									>
										Thu 50%
									</Button>
								</div>
							</>
						)}
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="p-method-select" className="text-sm font-medium">
							Phương thức
						</label>
						<Select
							id="p-method-select"
							items={paymentMethodItems}
							value={method}
							onValueChange={(value) => {
								if (value) setMethod(value);
							}}
						>
							<SelectTrigger
								className="w-full"
								aria-label="Phương thức thanh toán"
							>
								<SelectValue placeholder="Chọn phương thức" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{paymentMethodItems.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-1.5">
						<label className="text-sm font-medium">
							Ngày thu (tuỳ chọn)
						</label>
						<DatePickerField
							value={paidAt}
							onChange={setPaidAt}
							placeholder="Chọn ngày thu"
							nullable
						/>
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="p-note-input" className="text-sm font-medium">
							Ghi chú
						</label>
						<Input
							id="p-note-input"
							value={note}
							onChange={(event) => setNote(event.target.value)}
							placeholder="Nội dung giao dịch"
						/>
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="p-status-select" className="text-sm font-medium">
							Trạng thái đơn sau khi chốt
						</label>
						<Select
							id="p-status-select"
							items={statusItems}
							value={nextStatus}
							onValueChange={(value) => {
								if (value) setNextStatus(value as OrderStatus);
							}}
						>
							<SelectTrigger className="w-full" aria-label="Trạng thái đơn">
								<SelectValue placeholder="Chọn trạng thái" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{statusItems.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Hủy
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={
							loading ||
							statusUpdating ||
							orderUpdating ||
							isInvalidAmount ||
							!order
						}
					>
						{loading || statusUpdating || orderUpdating
							? "Đang lưu..."
							: isSettledAmount
								? "Xác nhận thanh toán"
								: refundableAmount > 0
									? "Hoàn cọc & chốt đơn"
									: "Ghi nhận thu tiền"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

type ProductRelatedPaymentsProps = {
	productId: string;
};

export function ProductRelatedPayments({
	productId,
}: ProductRelatedPaymentsProps) {
	const [collectOpen, setCollectOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] =
		useState<ProductRelatedOrder | null>(null);

	const { data, refetch } = useSuspenseQuery<ProductRelatedOrdersResponse>(
		PRODUCT_RELATED_ORDERS_QUERY,
		{
			variables: {
				productId,
				page: 1,
				pageSize: 8,
			},
		},
	);

	const orders = data?.ordersByProduct ?? [];
	const relevantOrders = useMemo(
		() =>
			orders.filter(
				(order) =>
					order.status !== OrderStatus.Returned ||
					order.paymentStatus !== PaymentStatus.Paid,
			),
		[orders],
	);
	const unpaidCount = relevantOrders.filter(
		(order) =>
			order.paymentStatus !== PaymentStatus.Paid && order.balanceDue > 0,
	).length;
	const sortedOrders = useMemo(() => {
		return [...relevantOrders].sort((a, b) => {
			const aDue = Math.max(a.balanceDue, 0);
			const bDue = Math.max(b.balanceDue, 0);
			if (aDue !== bDue) return bDue - aDue;
			return (
				new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime()
			);
		});
	}, [relevantOrders]);
	const totalOutstanding = useMemo(
		() =>
			relevantOrders.reduce(
				(sum, order) => sum + Math.max(order.balanceDue, 0),
				0,
			),
		[relevantOrders],
	);

	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<h2 className="text-xl font-extrabold tracking-tight text-foreground">
						Thanh toán liên quan sản phẩm
					</h2>
					<div className="text-xs text-muted-foreground">
						{relevantOrders.length} đơn cần xử lý
					</div>
				</div>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					<Card>
						<CardContent className="px-3 py-2">
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
								Tổng công nợ
							</p>
							<p className="mt-1 text-sm font-extrabold text-primary">
								{formatVnd(totalOutstanding)}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="px-3 py-2">
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
								Đơn cần thu
							</p>
							<p className="mt-1 text-sm font-bold text-foreground">
								{unpaidCount} / {relevantOrders.length} đơn
							</p>
						</CardContent>
					</Card>
				</div>
				{relevantOrders.length === 0 && (
					<div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
						Không có đơn nào cần xử lý trả hàng hoặc thanh toán.
					</div>
				)}
				<div className="grid gap-3">
					{sortedOrders.map((order) => {
						const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
						return (
							<Card key={order.id}>
								<CardContent className="p-3 flex flex-col gap-2">
									<div className="flex flex-wrap items-start justify-between gap-2">
										<div>
											<div className="font-semibold">{order.code}</div>
											<div className="text-xs text-muted-foreground">
												{order.customer.name} • {order.customer.phone}
											</div>
										</div>
										<span
											className={cn(
												"rounded-full px-2 py-0.5 text-[11px] font-semibold",
												paymentConfig.className,
											)}
										>
											{paymentConfig.label}
										</span>
									</div>

									<div className="grid grid-cols-2 gap-2 text-xs">
										<div className="rounded-md border bg-background/60 px-2 py-1.5">
											<p className="text-muted-foreground">Thuê</p>
											<p className="font-medium text-foreground">
												{formatDate(order.rentalDate)}
											</p>
										</div>
										<div className="rounded-md border bg-background/60 px-2 py-1.5">
											<p className="text-muted-foreground">Trả</p>
											<p className="font-medium text-foreground">
												{formatDate(order.returnDate)}
											</p>
										</div>
										<div className="rounded-md border bg-background/60 px-2 py-1.5">
											<p className="text-muted-foreground">Tổng tiền</p>
											<p className="font-semibold text-foreground">
												{formatVnd(order.totalAmount)}
											</p>
										</div>
										<div className="rounded-md border bg-background/60 px-2 py-1.5">
											<p className="text-muted-foreground">Còn nợ</p>
											<p
												className={cn(
													"font-extrabold",
													order.balanceDue > 0
														? "text-primary"
														: "text-chart-2",
												)}
											>
												{formatVnd(Math.max(order.balanceDue, 0))}
											</p>
										</div>
									</div>

									<div className="flex justify-end gap-2 pt-1">
										<Button
											size="sm"
											variant="outline"
											nativeButton={false}
											render={
												<Link to="/orders/$id" params={{ id: order.id }} />
											}
										>
											Xem đơn
										</Button>
										<Button
											size="sm"
											onClick={() => {
												setSelectedOrder(order);
												setCollectOpen(true);
											}}
										>
											Thu tiền
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>

			<CollectPaymentDialog
				open={collectOpen}
				onOpenChange={setCollectOpen}
				order={selectedOrder}
				onSuccess={() => {
					refetch();
				}}
			/>
		</>
	);
}
