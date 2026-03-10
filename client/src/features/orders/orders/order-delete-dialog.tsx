import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteOrder, ordersQuery } from "../graphql";
import { type OrderFragment } from "@/gql/graphql";

interface OrderDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: OrderFragment;
}

export function OrderDeleteDialog({
	open,
	onOpenChange,
	currentRow,
}: OrderDeleteDialogProps) {
	const [removeOrder, { loading }] = useMutation(deleteOrder, {
		variables: { id: currentRow.id },
		refetchQueries: [{ query: ordersQuery }],
		onCompleted: () => {
			toast.success("Đã xóa đơn hàng thành công");
			onOpenChange(false);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Lỗi khi xóa đơn hàng");
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Xác nhận xóa đơn hàng?</DialogTitle>
					<DialogDescription>
						Bạn có chắc chắn muốn xóa đơn hàng{" "}
						<span className="font-bold text-foreground">{currentRow.code}</span>?
						Hành động này không thể hoàn tác.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Hủy
					</Button>
					<Button
						variant="destructive"
						onClick={() => removeOrder()}
						disabled={loading}
					>
						{loading ? "Đang xóa..." : "Xóa đơn hàng"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
