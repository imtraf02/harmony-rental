import React, { useState } from "react";
import type { ItemFragment } from "@/gql/graphql";

type ItemsDialogType = "create" | "update" | "delete" | null;

type ItemsContextType = {
	open: ItemsDialogType;
	setOpen: (str: ItemsDialogType) => void;
	currentRow: ItemFragment | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<ItemFragment | null>>;
};

const ItemsContext = React.createContext<ItemsContextType | null>(null);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState<ItemsDialogType>(null);
	const [currentRow, setCurrentRow] = useState<ItemFragment | null>(null);

	return (
		<ItemsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
			{children}
		</ItemsContext>
	);
}

export const useItems = () => {
	const itemsContext = React.useContext(ItemsContext);

	if (!itemsContext) {
		throw new Error("useItems has to be used within <ItemsContext>");
	}

	return itemsContext;
};
