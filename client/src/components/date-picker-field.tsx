import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
	value: string | null | undefined;
	onChange: (val: string | null) => void;
	placeholder?: string;
	nullable?: boolean;
}

export function DatePickerField({
	value,
	onChange,
	placeholder = "Chọn ngày",
	nullable = false,
}: DatePickerFieldProps) {
	return (
		<div className="flex gap-2 items-center w-full">
			<Popover>
				<PopoverTrigger
					render={
						<Button
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal",
								!value && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{value ? (
								format(new Date(value), "dd/MM/yyyy")
							) : (
								<span>{placeholder}</span>
							)}
						</Button>
					}
				/>
				<PopoverContent className="w-auto p-0" align="start">
					<div className="flex flex-col">
						<Calendar
							mode="single"
							selected={value ? new Date(value) : undefined}
							onSelect={(date) =>
								onChange(date ? format(date, "yyyy-MM-dd") : null)
							}
						/>
						{nullable && (
							<div className="border-t p-2">
								<Button
									variant="ghost"
									size="sm"
									className="w-full text-xs h-8"
									onClick={() => {
										onChange(null);
									}}
								>
									Xóa ngày
								</Button>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
