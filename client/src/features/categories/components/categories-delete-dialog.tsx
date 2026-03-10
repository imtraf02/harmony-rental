import type { Reference } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { CategoryFragment } from "@/gql/graphql";
import { deleteCategory } from "../graphql";

interface CategoriesDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: CategoryFragment | null;
}

export function CategoriesDeleteDialog({
	open,
	onOpenChange,
	currentRow,
}: CategoriesDeleteDialogProps) {
	const [mutate, { loading }] = useMutation(deleteCategory, {
		update(cache, { data }) {
			const deletedCategory = data?.deleteCategory;
			if (!deletedCategory) return;

			cache.modify<{
				categories: readonly Reference[];
			}>({
				fields: {
					categories(existingRefs = [], { readField }) {
						return existingRefs.filter(
							(ref) => readField("id", ref) !== deletedCategory.id,
						);
					},
				},
			});

			toast.success("Xóa danh mục thành công");
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
					Xóa danh mục: {currentRow.name}
				</span>
			}
			desc={
				<>
					Bạn có chắc chắn muốn xóa danh mục{" "}
					<span className="font-bold">{currentRow.name}</span> này không?
					<br />
					<br />
					<span className="text-muted-foreground">
						Hành động này sẽ xóa dữ liệu vĩnh viễn và không thể hoàn tác. Các
						sản phẩm thuộc danh mục này có thể bị ảnh hưởng.
					</span>
				</>
			}
			confirmText="Xóa danh mục"
			destructive
		/>
	);
}
