import { useMutation } from "@apollo/client/react";
import {
	IconCheck,
	IconPackageExport,
	IconPackageImport,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table/bulk-actions";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OrderFragment } from "@/gql/graphql";
import { OrderStatus, PaymentStatus } from "@/gql/graphql";
import { deleteOrder, ordersQuery, updateOrderStatus } from "../graphql";

interface OrdersBulkActionsProps {
	table: Table<OrderFragment>;
}

export function OrdersBulkActions({ table }: OrdersBulkActionsProps) {
	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmConfig, setConfirmConfig] = useState<{
		title: string;
		desc: string;
		confirmText: string;
		destructive?: boolean;
		action: () => Promise<void>;
	} | null>(null);

	const [updateStatus] = useMutation(updateOrderStatus, {
		refetchQueries: [{ query: ordersQuery }],
	});

	const [removeOrder] = useMutation(deleteOrder, {
		refetchQueries: [{ query: ordersQuery }],
	});

	const openConfirm = (config: NonNullable<typeof confirmConfig>) => {
		setConfirmConfig(config);
		setConfirmOpen(true);
	};

	const executeWithConfirm = async () => {
		if (!confirmConfig) return;
		setConfirmLoading(true);
		try {
			await confirmConfig.action();
			setConfirmOpen(false);
			setConfirmConfig(null);
		} finally {
			setConfirmLoading(false);
		}
	};

	const handleBulkDelete = async () => {
		const count = selectedRows.length;
		const ids = selectedRows.map((row) => row.original.id);

		toast.promise(
			Promise.all(ids.map((id) => removeOrder({ variables: { id } }))),
			{
				loading: `Đang xóa ${count} đơn hàng...`,
				success: () => {
					table.resetRowSelection();
					return `Đã xóa ${count} đơn hàng thành công`;
				},
				error: "Lỗi khi xóa đơn hàng",
			},
		);
	};

	const handleBulkStatusChange = async (status: OrderStatus, label: string) => {
		const count = selectedRows.length;
		const ids = selectedRows.map((row) => row.original.id);

		toast.promise(
			Promise.all(ids.map((id) => updateStatus({ variables: { id, status } }))),
			{
				loading: `Đang cập nhật trạng thái cho ${count} đơn hàng...`,
				success: () => {
					table.resetRowSelection();
					return `Đã cập nhật trạng thái ${label} cho ${count} đơn hàng`;
				},
				error: "Lỗi khi cập nhật trạng thái",
			},
		);
	};

	const requestBulkCancel = () => {
		const completedPaidCount = selectedRows.filter(
			(row) =>
				row.original.status === OrderStatus.Returned &&
				row.original.paymentStatus === PaymentStatus.Paid,
		).length;
		if (completedPaidCount > 0) {
			toast.error(
				`Có ${completedPaidCount} đơn đã hoàn thành (đã trả + đã thanh toán), không thể hủy.`,
			);
			return;
		}
		openConfirm({
			title: "Xác nhận hủy đơn hàng",
			desc: `Bạn có chắc muốn hủy ${selectedRows.length} đơn đã chọn?`,
			confirmText: "Xác nhận hủy",
			destructive: true,
			action: async () =>
				handleBulkStatusChange(OrderStatus.Cancelled, "Đã hủy"),
		});
	};

	return (
		<>
			<BulkActionsToolbar table={table} entityName="đơn hàng">
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									openConfirm({
										title: "Xác nhận đơn hàng",
										desc: `Bạn có chắc muốn xác nhận ${selectedRows.length} đơn đã chọn?`,
										confirmText: "Xác nhận",
										action: async () =>
											handleBulkStatusChange(
												OrderStatus.Confirmed,
												"Đã xác nhận",
											),
									})
								}
								className="size-8 rounded-lg"
							>
								<IconCheck className="size-4" />
								<span className="sr-only">Xác nhận đơn hàng</span>
							</Button>
						}
					/>
					<TooltipContent>
						<p>Xác nhận đơn hàng</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									openConfirm({
										title: "Xác nhận khách đã lấy hàng",
										desc: `Bạn có chắc muốn đánh dấu ${selectedRows.length} đơn là khách đã lấy hàng?`,
										confirmText: "Xác nhận lấy hàng",
										action: async () =>
											handleBulkStatusChange(
												OrderStatus.PickedUp,
												"Đã lấy hàng",
											),
									})
								}
								className="size-8 rounded-lg"
							>
								<IconPackageExport className="size-4" />
								<span className="sr-only">Xác nhận lấy hàng</span>
							</Button>
						}
					/>
					<TooltipContent>
						<p>Xác nhận khách đã lấy hàng</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									openConfirm({
										title: "Xác nhận khách đã trả hàng",
										desc: `Bạn có chắc muốn đánh dấu ${selectedRows.length} đơn là đã trả hàng?`,
										confirmText: "Xác nhận trả hàng",
										action: async () =>
											handleBulkStatusChange(
												OrderStatus.Returned,
												"Đã trả hàng",
											),
									})
								}
								className="size-8 rounded-lg"
							>
								<IconPackageImport className="size-4" />
								<span className="sr-only">Xác nhận trả hàng</span>
							</Button>
						}
					/>
					<TooltipContent>
						<p>Xác nhận khách đã trả hàng</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="outline"
								size="icon"
								onClick={requestBulkCancel}
								className="size-8 rounded-lg text-destructive hover:bg-destructive/10"
							>
								<IconX className="size-4" />
								<span className="sr-only">Hủy đơn hàng</span>
							</Button>
						}
					/>
					<TooltipContent>
						<p>Hủy đơn hàng</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant="destructive"
								size="icon"
								onClick={() =>
									openConfirm({
										title: "Xác nhận xóa đơn hàng",
										desc: `Bạn có chắc muốn xóa ${selectedRows.length} đơn đã chọn?`,
										confirmText: "Xóa đơn",
										destructive: true,
										action: handleBulkDelete,
									})
								}
								className="size-8 rounded-lg"
							>
								<IconTrash className="size-4" />
								<span className="sr-only">Xóa đơn hàng</span>
							</Button>
						}
					/>
					<TooltipContent>
						<p>Xóa đơn hàng</p>
					</TooltipContent>
				</Tooltip>
			</BulkActionsToolbar>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={confirmConfig?.title ?? "Xác nhận thao tác"}
				desc={confirmConfig?.desc ?? ""}
				confirmText={confirmConfig?.confirmText ?? "Xác nhận"}
				destructive={confirmConfig?.destructive}
				isLoading={confirmLoading}
				handleConfirm={() => {
					void executeWithConfirm();
				}}
			/>
		</>
	);
}
