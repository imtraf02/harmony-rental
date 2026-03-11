import { useMutation } from "@apollo/client/react";
import {
	IconCheck,
	IconCoins,
	IconDots,
	IconEdit,
	IconEye,
	IconPackageExport,
	IconPackageImport,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrderFragment } from "@/gql/graphql";
import { OrderStatus, PaymentStatus } from "@/gql/graphql";
import { formatVnd } from "@/lib/format";
import { useOrders } from "../common/orders-provider";
import { ordersQuery, updateOrderStatus } from "../graphql";

interface OrderRowActionsProps {
	row: Row<OrderFragment>;
}

export function OrderRowActions({ row }: OrderRowActionsProps) {
	const { setOpen, setCurrentRow } = useOrders();
	const order = row.original;
	const canConfirm = order.status === OrderStatus.Pending;
	const canPickedUp =
		order.status === OrderStatus.Confirmed ||
		order.status === OrderStatus.Pending;
	const canReturned = order.status === OrderStatus.PickedUp;
	const canCollectPayment = order.paymentStatus !== PaymentStatus.Paid;
	const canCancel =
		order.status !== OrderStatus.Cancelled &&
		order.status !== OrderStatus.Returned;
	const hasStatusActions = canConfirm || canPickedUp || canReturned;
	const hasPaymentAction = canCollectPayment;
	const hasDangerActions = canCancel;

	const [updateStatus] = useMutation(updateOrderStatus, {
		refetchQueries: [{ query: ordersQuery }],
	});

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmData, setConfirmData] = useState<{
		status: OrderStatus;
		label: string;
		title: string;
		desc: string;
	}>({
		status: OrderStatus.Pending,
		label: "",
		title: "",
		desc: "",
	});

	const executeStatusChange = (status: OrderStatus, label: string) => {
		toast.promise(updateStatus({ variables: { id: order.id, status } }), {
			loading: `Đang cập nhật trạng thái...`,
			success: `Đã cập nhật: ${label}`,
			error: "Lỗi khi cập nhật trạng thái",
		});
	};

	const handleStatusChange = (status: OrderStatus, label: string) => {
		const totalRequiredDeposit = order.items.reduce(
			(acc, item) => acc + item.deposit,
			0,
		);

		if (
			status === OrderStatus.PickedUp &&
			order.depositPaid < totalRequiredDeposit
		) {
			setConfirmData({
				status,
				label,
				title: "Xác nhận giao đồ",
				desc: `Khách chưa cọc đủ tiền (Thiếu ${formatVnd(totalRequiredDeposit - order.depositPaid)}). Bạn có chắc chắn vẫn muốn giao đồ cho khách không?`,
			});
			setConfirmOpen(true);
			return;
		}

		if (status === OrderStatus.Returned && order.balanceDue > 0) {
			setConfirmData({
				status,
				label,
				title: "Xác nhận trả đồ",
				desc: `Đơn hàng vẫn còn nợ ${formatVnd(order.balanceDue)}. Bạn có chắc chắn muốn xác nhận trả đồ không?`,
			});
			setConfirmOpen(true);
			return;
		}

		executeStatusChange(status, label);
	};
	const openCollectPaymentDialog = () => {
		setCurrentRow(order);
		setOpen("collect-payment");
	};
	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
						>
							<IconDots className="size-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-[200px]">
					<DropdownMenuItem
						render={
							<Link
								to="/orders/$id"
								params={{ id: order.id }}
								className="flex w-full items-center"
							/>
						}
					>
						Xem chi tiết
						<DropdownMenuShortcut>
							<IconEye className="size-4" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => {
							setCurrentRow(order);
							setOpen("update");
						}}
					>
						Chỉnh sửa thông tin
						<DropdownMenuShortcut>
							<IconEdit className="size-4" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>

					{(hasStatusActions || hasPaymentAction || hasDangerActions) && (
						<DropdownMenuSeparator />
					)}

					{canConfirm && (
						<DropdownMenuItem
							onClick={() =>
								handleStatusChange(OrderStatus.Confirmed, "Đã xác nhận")
							}
						>
							Xác nhận đơn hàng
							<DropdownMenuShortcut>
								<IconCheck className="size-4" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}

					{canPickedUp && (
						<DropdownMenuItem
							onClick={() =>
								handleStatusChange(OrderStatus.PickedUp, "Đã lấy hàng")
							}
						>
							Khách đã lấy đồ
							<DropdownMenuShortcut>
								<IconPackageExport className="size-4" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}

					{canReturned && (
						<DropdownMenuItem
							onClick={() =>
								handleStatusChange(OrderStatus.Returned, "Đã trả hàng")
							}
						>
							Đã trả hàng (Xong)
							<DropdownMenuShortcut>
								<IconPackageImport className="size-4" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}

					{hasStatusActions && hasPaymentAction && <DropdownMenuSeparator />}

					{canCollectPayment && (
						<DropdownMenuItem onClick={openCollectPaymentDialog}>
							Thu tiền
							<DropdownMenuShortcut>
								<IconCoins className="size-4" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}

					{(hasStatusActions || hasPaymentAction) && hasDangerActions && (
						<DropdownMenuSeparator />
					)}

					{canCancel && (
						<DropdownMenuItem
							onClick={() =>
								handleStatusChange(OrderStatus.Cancelled, "Đã hủy")
							}
						>
							Hủy đơn hàng
							<DropdownMenuShortcut>
								<IconX className="size-4" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						onClick={() => {
							setCurrentRow(order);
							setOpen("delete");
						}}
						variant="destructive"
					>
						Xóa đơn hàng
						<DropdownMenuShortcut>
							<IconTrash className="size-4 text-destructive" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={confirmData.title}
				desc={confirmData.desc}
				handleConfirm={() => {
					executeStatusChange(confirmData.status, confirmData.label);
					setConfirmOpen(false);
				}}
			/>
		</>
	);
}
