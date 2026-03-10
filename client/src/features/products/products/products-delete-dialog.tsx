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
import type { ProductFragment } from "@/gql/graphql";
import { deleteProduct } from "../graphql/mutations";
import { productsQuery } from "../graphql/queries";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: ProductFragment;
}

export function ProductsDeleteDialog({
	open,
	onOpenChange,
	currentRow,
}: Props) {
	const [mutate, { loading }] = useMutation(deleteProduct, {
		refetchQueries: [{ query: productsQuery }],
		onCompleted: () => {
			toast.success("Xóa sản phẩm thành công");
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message),
	});

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
					<AlertDialogDescription>
						Hành động này sẽ xóa sản phẩm <strong>{currentRow.name}</strong> và
						tất cả các biến thể, vật phẩm liên quan. Không thể hoàn tác.
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
						{loading ? "Đang xóa..." : "Xóa sản phẩm"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
