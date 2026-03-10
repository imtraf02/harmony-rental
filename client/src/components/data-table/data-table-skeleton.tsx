import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
	rowCount?: number;
	columnCount?: number;
}

export function DataTableSkeleton({
	rowCount = 10,
	columnCount = 6,
}: DataTableSkeletonProps) {
	return (
		<div className="flex flex-col gap-4">
			{/* Toolbar skeleton */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</div>
				<Skeleton className="h-8 w-24" />
			</div>

			{/* Table skeleton */}
			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							{Array.from({ length: columnCount }).map((_, i) => (
								<TableHead key={`head-${i}`}>
									<Skeleton className="h-4 w-full" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: rowCount }).map((_, i) => (
							<TableRow key={`row-${i}`}>
								{Array.from({ length: columnCount }).map((_, j) => (
									<TableCell key={`cell-${i}-${j}`}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination skeleton */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-4 w-64" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</div>
			</div>
		</div>
	);
}
