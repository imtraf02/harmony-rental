import { useSuspenseQuery } from "@apollo/client/react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import type { CustomerFragment } from "@/gql/graphql";
import { customersQuery } from "../graphql";

interface CustomersSelectProps {
	value?: string;
	onValueChange: (customer: CustomerFragment | null) => void;
	placeholder?: string;
}

export function CustomersSelect({
	value,
	onValueChange,
	placeholder = "Tìm và chọn khách hàng cũ...",
}: CustomersSelectProps) {
	const { data } = useSuspenseQuery(customersQuery);
	const customers = data?.customers ?? [];

	return (
		<Combobox
			items={customers}
			itemToStringLabel={(customer: CustomerFragment | null) =>
				customer ? `${customer.name} - ${customer.phone}` : ""
			}
			onValueChange={onValueChange}
		>
			<ComboboxInput placeholder={placeholder} />
			<ComboboxContent>
				<ComboboxEmpty>Không tìm thấy khách hàng.</ComboboxEmpty>
				<ComboboxList>
					{(customer: CustomerFragment) => (
						<ComboboxItem key={customer.id} value={customer}>
							<div className="flex flex-col">
								<span className="font-medium text-sm">{customer.name}</span>
								<span className="text-xs text-muted-foreground">
									{customer.phone}
								</span>
							</div>
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
