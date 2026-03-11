import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DatePickerField } from "@/components/date-picker-field";
import { Button } from "@/components/ui/button";
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
import { getOrderStatusConfig } from "@/features/orders/constants/status";
import {
	paymentMethodItems,
	paymentMethodLabelMap,
} from "@/features/payments/constants/payment-methods";
import { PAYMENT_HISTORY_QUERY } from "@/features/payments/graphql/queries";
import { type OrderFragment, OrderStatus } from "@/gql/graphql";
import { formatVnd } from "@/lib/format";
import { ordersQuery, updateOrder, updateOrderStatus } from "../graphql";

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

interface OrderCollectPaymentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: OrderFragment;
}



export function OrderCollectPaymentDialog({
	open,
	onOpenChange,
	currentRow,
}: OrderCollectPaymentDialogProps) {
	const dueAmount = useMemo(
		() => Math.max(currentRow.balanceDue, 0),
		[currentRow.balanceDue],
	);
	const refundableAmount = useMemo(
		() => Math.max(-currentRow.balanceDue, 0),
		[currentRow.balanceDue],
	);
	const [amountInput, setAmountInput] = useState<string>(
		String(dueAmount || ""),
	);
	const [method, setMethod] = useState(paymentMethodItems[0]?.value ?? "CASH");
	const [note, setNote] = useState("");
	const [paidAt, setPaidAt] = useState<string | null>(null);
	const [nextStatus, setNextStatus] = useState<OrderStatus>(currentRow.status);

	useEffect(() => {
		if (!open) return;
		setAmountInput(String(dueAmount || ""));
		setMethod(paymentMethodItems[0]?.value ?? "CASH");
		setNote("");
		setPaidAt(null);
		setNextStatus(currentRow.status);
	}, [open, dueAmount, currentRow.status]);

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
							orderId: currentRow.id,
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
						id: currentRow.id,
						input: {
							note: currentRow.note
								? `${currentRow.note}\n${normalizedNote}`
								: normalizedNote,
						},
					},
				});
			}

			if (nextStatus !== currentRow.status) {
				await updateStatus({
					variables: {
						id: currentRow.id,
						status: nextStatus,
					},
				});
			}

			toast.success(
				isSettledAmount
					? "Đã xác nhận thanh toán."
					: refundableAmount > 0
						? "Đã hoàn cọc dư và cập nhật thanh toán."
						: "Đã ghi nhận thanh toán thành công.",
			);
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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Thu tiền đơn {currentRow.code}</DialogTitle>
					<DialogDescription>
						{refundableAmount > 0 ? (
							<>
								Khách: {currentRow.customer.name} • Hoàn cọc dư:{" "}
								{formatVnd(refundableAmount)}
							</>
						) : isSettledAmount ? (
							<>
								Khách: {currentRow.customer.name} • Đơn đã cân bằng công nợ
								(0đ), bấm để xác nhận thanh toán.
							</>
						) : (
							<>
								Khách: {currentRow.customer.name} • Còn nợ:{" "}
								{formatVnd(dueAmount)}
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 gap-3 py-2">
					<div className="grid gap-1.5">
						<label htmlFor="amount-input" className="text-sm font-medium">
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
									id="amount-input"
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
						<label htmlFor="method-select" className="text-sm font-medium">
							Phương thức
						</label>
						<Select
							id="method-select"
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
						<label htmlFor="note-input" className="text-sm font-medium">
							Ghi chú
						</label>
						<Input
							id="note-input"
							value={note}
							onChange={(event) => setNote(event.target.value)}
							placeholder="Nội dung giao dịch"
						/>
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="status-select" className="text-sm font-medium">
							Trạng thái đơn sau khi chốt
						</label>
						<Select
							id="status-select"
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
							loading || statusUpdating || orderUpdating || isInvalidAmount
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
