import React, { useState } from "react";
import type { CustomerFragment } from "@/gql/graphql";

type CustomersDialogType = "create" | "update" | "delete" | null;

type CustomersContextType = {
	open: CustomersDialogType;
	setOpen: (str: CustomersDialogType) => void;
	currentRow: CustomerFragment | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<CustomerFragment | null>>;
};

const CustomersContext = React.createContext<CustomersContextType | null>(
	null,
);

export function CustomersProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState<CustomersDialogType>(null);
	const [currentRow, setCurrentRow] = useState<CustomerFragment | null>(null);

	return (
		<CustomersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
			{children}
		</CustomersContext.Provider>
	);
}

export const useCustomers = () => {
	const customersContext = React.useContext(CustomersContext);

	if (!customersContext) {
		throw new Error("useCustomers has to be used within <CustomersProvider>");
	}

	return customersContext;
};
