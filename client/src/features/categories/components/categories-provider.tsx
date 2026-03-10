import React, { useState } from "react";
import type { CategoryFragment } from "@/gql/graphql";

type CategoriesDialogType = "create" | "update" | "delete" | null;

type CategoriesContextType = {
	open: CategoriesDialogType;
	setOpen: (str: CategoriesDialogType) => void;
	currentRow: CategoryFragment | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<CategoryFragment | null>>;
};

const CategoriesContext = React.createContext<CategoriesContextType | null>(
	null,
);

export function CategoriesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState<CategoriesDialogType>(null);
	const [currentRow, setCurrentRow] = useState<CategoryFragment | null>(null);

	return (
		<CategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
			{children}
		</CategoriesContext>
	);
}

export const useCategories = () => {
	const categoriesContext = React.useContext(CategoriesContext);

	if (!categoriesContext) {
		throw new Error("useCategories has to be used within <CategoriesContext>");
	}

	return categoriesContext;
};
