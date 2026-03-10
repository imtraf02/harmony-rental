import { CategoriesCreateDialog } from "./categories-create-dialog";
import { CategoriesDeleteDialog } from "./categories-delete-dialog";
import { CategoriesEditDialog } from "./categories-edit-dialog";
import { useCategories } from "./categories-provider";

export function CategoriesDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useCategories();

	return (
		<>
			<CategoriesCreateDialog
				open={open === "create"}
				onOpenChange={() => setOpen(null)}
			/>
			{currentRow && (
				<>
					<CategoriesEditDialog
						open={open === "update"}
						onOpenChange={() => {
							setOpen(null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						currentRow={currentRow}
					/>
					<CategoriesDeleteDialog
						open={open === "delete"}
						onOpenChange={() => {
							setOpen(null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						currentRow={currentRow}
					/>
				</>
			)}
		</>
	);
}
