import {
	IconArrowDown,
	IconArrowsSort,
	IconArrowUp,
	IconEyeOff,
} from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DataTableColumnHeaderProps<TData, TValue> =
	React.HTMLAttributes<HTMLDivElement> & {
		column: Column<TData, TValue>;
		title: string;
	};

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="sm"
							className="h-8 data-[state=open]:bg-accent"
						>
							<span>{title}</span>
							{column.getIsSorted() === "desc" ? (
								<IconArrowDown className="ms-2 h-4 w-4" />
							) : column.getIsSorted() === "asc" ? (
								<IconArrowUp className="ms-2 h-4 w-4" />
							) : (
								<IconArrowsSort className="ms-2 h-4 w-4" />
							)}
						</Button>
					}
				></DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
							<IconArrowUp className="size-3.5 text-muted-foreground/70" />
							Tăng dần
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
							<IconArrowDown className="size-3.5 text-muted-foreground/70" />
							Giảm dần
						</DropdownMenuItem>
						{column.getCanHide() && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => column.toggleVisibility(false)}
								>
									<IconEyeOff className="size-3.5 text-muted-foreground/70" />
									Ẩn
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
