import { CustomersCreateDialog } from "../new/customers-create-dialog";
import { CustomersDeleteDialog } from "../customers/customers-delete-dialog";
import { CustomersEditDialog } from "../customers/customers-edit-dialog";
import { useCustomers } from "./customers-provider";

export function CustomersDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useCustomers();

	return (
		<>
			<CustomersCreateDialog
				open={open === "create"}
				onOpenChange={(val) => {
					if (!val) setOpen(null);
				}}
			/>
			{currentRow && (
				<>
					<CustomersEditDialog
						open={open === "update"}
						onOpenChange={(val) => {
							if (!val) {
								setOpen(null);
								setTimeout(() => setCurrentRow(null), 500);
							}
						}}
						currentRow={currentRow}
					/>
					<CustomersDeleteDialog
						open={open === "delete"}
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
