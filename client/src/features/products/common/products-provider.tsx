import { createContext, useContext, useState } from "react";
import type { ProductFragment, VariantFragment } from "@/gql/graphql";

type ProductsDialogType = 
	| "create" 
	| "update" 
	| "delete" 
	| "variant-create" 
	| "variant-update"
	| "variant-delete"
	| "item-create"
	| null;

interface ProductsContextType {
	open: ProductsDialogType;
	setOpen: (open: ProductsDialogType) => void;
	currentRow: ProductFragment | null;
	setCurrentRow: (row: ProductFragment | null) => void;
	currentVariant: VariantFragment | null;
	setCurrentVariant: (v: VariantFragment | null) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState<ProductsDialogType>(null);
	const [currentRow, setCurrentRow] = useState<ProductFragment | null>(null);
	const [currentVariant, setCurrentVariant] = useState<VariantFragment | null>(null);

	return (
		<ProductsContext.Provider
			value={{
				open,
				setOpen,
				currentRow,
				setCurrentRow,
				currentVariant,
				setCurrentVariant,
			}}
		>
			{children}
		</ProductsContext.Provider>
	);
}

export function useProducts() {
	const context = useContext(ProductsContext);
	if (!context) {
		throw new Error("useProducts must be used within a ProductsProvider");
	}
	return context;
}
