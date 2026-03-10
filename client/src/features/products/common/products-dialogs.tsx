import { ItemsCreateDialog } from "@/features/items/components/items-create-dialog";
import { ProductsCreateDialog } from "../new/products-create-dialog";
import { ProductsDeleteDialog } from "../products/products-delete-dialog";
import { ProductsEditDialog } from "../products/products-edit-dialog";
import { VariantCreateDialog } from "../detail/variant-create-dialog";
import { VariantDeleteDialog } from "../detail/variant-delete-dialog";
import { VariantEditDialog } from "../detail/variant-edit-dialog";
import { useProducts } from "./products-provider";

export function ProductsDialogs() {
	const {
		open,
		setOpen,
		currentRow,
		setCurrentRow,
		currentVariant,
		setCurrentVariant,
	} = useProducts();

	const handleClose = () => {
		setOpen(null);
		setTimeout(() => {
			setCurrentRow(null);
			setCurrentVariant(null);
		}, 500);
	};

	return (
		<>
			{/* Product Dialogs */}
			<ProductsCreateDialog
				open={open === "create"}
				onOpenChange={(o: boolean) => !o && handleClose()}
			/>
			{currentRow && (
				<>
					<ProductsEditDialog
						open={open === "update"}
						onOpenChange={(o: boolean) => !o && handleClose()}
						currentRow={currentRow}
					/>
					<ProductsDeleteDialog
						open={open === "delete"}
						onOpenChange={(o: boolean) => !o && handleClose()}
						currentRow={currentRow}
					/>
					<VariantCreateDialog
						open={open === "variant-create"}
						onOpenChange={(o: boolean) => !o && handleClose()}
						productId={currentRow.id}
					/>
				</>
			)}

			{/* Variant Dialogs */}
			{currentVariant && (
				<>
					<VariantEditDialog
						open={open === "variant-update"}
						onOpenChange={(o: boolean) => !o && handleClose()}
						variant={currentVariant}
					/>
					<VariantDeleteDialog
						open={open === "variant-delete"}
						onOpenChange={(o: boolean) => !o && handleClose()}
						variant={currentVariant}
					/>
					<ItemsCreateDialog 
						open={open === "item-create"}
						onOpenChange={(o: boolean) => { if (!o) handleClose(); }}
						initialProductId={currentRow?.id}
						initialVariantId={currentVariant.id}
					/>
				</>
			)}
		</>
	);
}
