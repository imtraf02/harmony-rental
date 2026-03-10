import { createContext, useContext, useState } from "react";
import type { OrderFragment } from "@/gql/graphql";

type OrdersDialogType =
	| "create"
	| "update"
	| "delete"
	| "collect-payment"
	| null;

interface OrdersContextType {
	open: OrdersDialogType;
	setOpen: (open: OrdersDialogType) => void;
	currentRow: OrderFragment | null;
	setCurrentRow: (row: OrderFragment | null) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState<OrdersDialogType>(null);
	const [currentRow, setCurrentRow] = useState<OrderFragment | null>(null);

	return (
		<OrdersContext.Provider
			value={{
				open,
				setOpen,
				currentRow,
				setCurrentRow,
			}}
		>
			{children}
		</OrdersContext.Provider>
	);
}

export function useOrders() {
	const context = useContext(OrdersContext);
	if (!context) {
		throw new Error("useOrders must be used within an OrdersProvider");
	}
	return context;
}
