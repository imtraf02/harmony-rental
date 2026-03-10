// CategorySelect.tsx
import { useSuspenseQuery } from "@apollo/client/react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { categories as categoriesQuery } from "@/features/categories/graphql";

interface CategoriesSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	isInvalid?: boolean;
	placeholder?: string;
}

export function CategoriesSelect({
	value,
	onValueChange,
	isInvalid,
	placeholder = "Chọn danh mục...",
}: CategoriesSelectProps) {
	const { data } = useSuspenseQuery(categoriesQuery);

	const categories = data.categories.map((c) => ({
		label: c.name,
		value: c.id,
	}));

	const items =
		placeholder === "Tất cả"
			? [{ label: "Tất cả danh mục", value: "all" }, ...categories]
			: categories;

	return (
		<Select
			items={items}
			value={value}
			onValueChange={(val: string | null) => val && onValueChange(val)}
		>
			<SelectTrigger aria-invalid={isInvalid} className="h-8 w-full">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{items.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
