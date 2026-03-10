import { OrderCollectPaymentDialog } from "../orders/order-collect-payment-dialog";
import { OrderDeleteDialog } from "../orders/order-delete-dialog";
import { OrderEditDialog } from "../orders/order-edit-dialog";
import { useOrders } from "./orders-provider";

export function OrdersDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useOrders();

	return (
		<>
			{currentRow && (
				<>
					<OrderEditDialog
						open={open === "update"}
						onOpenChange={(val) => {
							if (!val) {
								setOpen(null);
								setTimeout(() => setCurrentRow(null), 500);
							}
						}}
						currentRow={currentRow}
					/>
					<OrderDeleteDialog
						open={open === "delete"}
						onOpenChange={(val) => {
							if (!val) {
								setOpen(null);
								setTimeout(() => setCurrentRow(null), 500);
							}
						}}
						currentRow={currentRow}
					/>
					<OrderCollectPaymentDialog
						open={open === "collect-payment"}
						onOpenChange={(val) => {
							if (!val) {
								setOpen(null);
								setTimeout(() => setCurrentRow(null), 500);
							}
						}}
						currentRow={currentRow}
					/>
				</>
			)}
		</>
	);
}
