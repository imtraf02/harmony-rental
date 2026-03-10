import { useMutation } from "@apollo/client/react";
import { IconAlertTriangle } from "@tabler/icons-react";
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
import type { VariantFragment } from "@/gql/graphql";
import { deleteProductVariant } from "../graphql/mutations";
import { productQuery } from "../graphql/queries";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	variant: VariantFragment;
}

export function VariantDeleteDialog({ open, onOpenChange, variant }: Props) {
	const [mutate, { loading }] = useMutation(deleteProductVariant, {
		variables: { id: variant.id },
		refetchQueries: [{ query: productQuery, variables: { id: variant.productId } }],
		onCompleted: () => {
			toast.success("Xóa biến thể thành công");
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message),
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2 text-destructive mb-2">
						<IconAlertTriangle className="h-6 w-6" />
						<DialogTitle>Xóa biến thể</DialogTitle>
					</div>
					<DialogDescription>
						Bạn có chắc chắn muốn xóa biến thể <strong>{variant.color} - {variant.size}</strong>? 
						Hành động này không thể hoàn tác và sẽ xóa tất cả các món đồ thuộc biến thể này.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="mt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Hủy
					</Button>
					<Button
						variant="destructive"
						onClick={() => mutate()}
						disabled={loading}
					>
						{loading ? "Đang xóa..." : "Xác nhận xóa"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
