import { useSuspenseQuery } from "@apollo/client/react";
import {
	IconDotsVertical,
	IconFolder,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryFragment } from "@/gql/graphql";
import { getCategoryIcon } from "@/lib/category-icons";
import { categories as categoriesQuery } from "../graphql";
import { useCategories } from "./categories-provider";

interface Props {
	searchTerm?: string;
	sort?: "asc" | "desc";
}

function CategoriesListSkeleton() {
	return (
		<ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<Skeleton
					key={i}
					className="h-30 w-full rounded-lg"
					style={{ animationDelay: `${i * 60}ms` }}
				/>
			))}
		</ul>
	);
}

function CategoriesEmpty() {
	return (
		<div className="flex min-h-100 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
			<IconFolder className="h-10 w-10 opacity-30" />
			<p className="font-medium">Chưa có danh mục nào</p>
			<p className="text-sm">Nhấn "Thêm danh mục" để bắt đầu.</p>
		</div>
	);
}

function CategoryCard({ category }: { category: CategoryFragment }) {
	const { setOpen, setCurrentRow } = useCategories();
	const Icon = getCategoryIcon(category.name);

	return (
		<li className="rounded-lg border p-4 hover:shadow-md transition-all duration-200">
			<div className="mb-8 flex items-center justify-between">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 p-2">
					<Icon className="h-5 w-5 text-primary" />
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<IconDotsVertical className="h-4 w-4" />
							</Button>
						}
					></DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {
								setCurrentRow(category);
								setOpen("update");
							}}
						>
							<IconPencil className="mr-2 h-4 w-4" />
							Chỉnh sửa
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							onClick={() => {
								setCurrentRow(category);
								setOpen("delete");
							}}
						>
							<IconTrash className="mr-2 h-4 w-4" />
							Xóa
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div>
				<h2 className="mb-1 font-semibold">{category.name}</h2>
				{category.description ? (
					<p className="line-clamp-2 text-sm text-gray-500">
						{category.description}
					</p>
				) : (
					<p className="text-sm text-muted-foreground/50 italic">
						Chưa có mô tả
					</p>
				)}
			</div>
		</li>
	);
}

function CategoriesListInner({ searchTerm = "", sort = "asc" }: Props) {
	const { data } = useSuspenseQuery(categoriesQuery);
	const categories = (data?.categories ?? [])
		.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) =>
			sort === "asc"
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name),
		);

	if (categories.length === 0) return <CategoriesEmpty />;

	return (
		<ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
			{categories.map((category) => (
				<CategoryCard key={category.id} category={category} />
			))}
		</ul>
	);
}

export function CategoriesList({ searchTerm, sort }: Props) {
	return (
		<Suspense fallback={<CategoriesListSkeleton />}>
			<CategoriesListInner searchTerm={searchTerm} sort={sort} />
		</Suspense>
	);
}
