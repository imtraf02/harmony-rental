import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CustomerFragment } from "@/gql/graphql";
import { customersQuery, deleteCustomer } from "../graphql";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: CustomerFragment;
}

export function CustomersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
	const [mutate, { loading }] = useMutation(deleteCustomer, {
		onCompleted: () => {
			toast.success("Xóa khách hàng thành công");
			onOpenChange(false);
		},
		onError: (err) => {
			toast.error(err.message || "Đã có lỗi xảy ra");
		},
		refetchQueries: [{ query: customersQuery }],
	});

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
					<AlertDialogDescription>
						Hành động này không thể hoàn tác. Khách hàng{" "}
						<span className="font-bold text-foreground">{currentRow.name}</span>{" "}
						sẽ bị xóa vĩnh viễn khỏi hệ thống.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
					<AlertDialogAction
						disabled={loading}
						onClick={(e) => {
							e.preventDefault();
							mutate({ variables: { id: currentRow.id } });
						}}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{loading ? "Đang xóa..." : "Xác nhận xóa"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
