import { ItemsCreateDialog } from "./items-create-dialog";
import { ItemsDeleteDialog } from "./items-delete-dialog";
import { ItemsEditDialog } from "./items-edit-dialog";
import { useItems } from "./items-provider";

export function ItemsDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useItems();

	return (
		<>
			<ItemsCreateDialog
				open={open === "create"}
				onOpenChange={() => setOpen(null)}
			/>
			{currentRow && (
				<>
					<ItemsEditDialog
						open={open === "update"}
						onOpenChange={() => {
							setOpen(null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						currentRow={currentRow}
					/>
					<ItemsDeleteDialog
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
