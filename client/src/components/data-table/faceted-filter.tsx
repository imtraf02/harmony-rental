import { IconCheck, IconCirclePlus } from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DataTableFacetedFilterProps<TData, TValue> = {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
	value?: TValue[];
	onChange?: (value: TValue[]) => void;
};

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
	value,
	onChange,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(
		(value !== undefined ? value : (column?.getFilterValue() as TValue[])) || [],
	);

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button variant="outline" size="sm" className="h-8 border-dashed">
						<IconCirclePlus className="size-4" />
						{title}
						{selectedValues?.size > 0 && (
							<>
								<Separator
									orientation="vertical"
									className="mx-2 h-4 data-[orientation=vertical]:self-center"
								/>
								<Badge
									variant="secondary"
									className="rounded-sm px-1 font-normal lg:hidden"
								>
									{selectedValues.size}
								</Badge>
								<div className="hidden space-x-1 lg:flex">
									{selectedValues.size > 2 ? (
										<Badge
											variant="secondary"
											className="rounded-sm px-1 font-normal"
										>
											{selectedValues.size} đã chọn
										</Badge>
									) : (
										options
											.filter((option) =>
												selectedValues.has(option.value as unknown as TValue),
											)
											.map((option) => (
												<Badge
													variant="secondary"
													key={option.value}
													className="rounded-sm px-1 font-normal"
												>
													{option.label}
												</Badge>
											))
									)}
								</div>
							</>
						)}
					</Button>
				}
			></PopoverTrigger>
			<PopoverContent className="w-50 p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value as unknown as TValue);
											} else {
												selectedValues.add(option.value as unknown as TValue);
											}
											const filterValues = Array.from(selectedValues);
											if (onChange) {
												onChange(filterValues);
											} else {
												column?.setFilterValue(
													filterValues.length ? filterValues : undefined,
												);
											}
										}}
									>
										<div
											className={cn(
												"flex size-4 items-center justify-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<IconCheck className={cn("h-4 w-4 text-background")} />
										</div>
										{option.icon && (
											<option.icon className="size-4 text-muted-foreground" />
										)}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											if (onChange) {
												onChange([]);
											} else {
												column?.setFilterValue(undefined);
											}
										}}
										className="justify-center text-center"
									>
										Xóa bộ lọc
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
