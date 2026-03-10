import type { Reference } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { ItemFragment } from "@/gql/graphql";
import { deleteItem } from "../graphql";

interface ItemsDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: ItemFragment | null;
}

export function ItemsDeleteDialog({
	open,
	onOpenChange,
	currentRow,
}: ItemsDeleteDialogProps) {
	const [mutate, { loading }] = useMutation(deleteItem, {
		update(cache, { data }) {
			const deletedItem = data?.deleteItem;
			if (!deletedItem) return;

			cache.modify<{
				items: readonly Reference[];
			}>({
				fields: {
					items(existingRefs = [], { readField }) {
						return existingRefs.filter(
							(ref) => readField("id", ref) !== deletedItem.id,
						);
					},
				},
			});

			toast.success("Xóa sản phẩm thành công");
			onOpenChange(false);
		},
	});

	if (!currentRow) return null;

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={() => {
				mutate({
					variables: {
						id: currentRow.id,
					},
				});
			}}
			disabled={loading}
			title={
				<span className="text-destructive">
					Xóa sản phẩm: {currentRow.name}
				</span>
			}
			desc={
				<>
					Bạn có chắc chắn muốn xóa sản phẩm{" "}
					<span className="font-bold">{currentRow.name}</span> (mã:{" "}
					<span className="font-mono">{currentRow.code}</span>) này không?
					<br />
					<br />
					<span className="text-muted-foreground">
						Hành động này sẽ xóa dữ liệu vĩnh viễn và không thể hoàn tác.
					</span>
				</>
			}
			confirmText="Xóa sản phẩm"
			destructive
		/>
	);
}
