import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CategoriesDialogs } from "./components/categories-dialogs";
import { CategoriesList } from "./components/categories-list";
import { CategoriesPrimaryButtons } from "./components/categories-primary-buttons";
import { CategoriesProvider } from "./components/categories-provider";

export function Categories() {
	const [searchTerm, setSearchTerm] = useState("");
	const [sort, setSort] = useState<"asc" | "desc">("asc");

	return (
		<CategoriesProvider>
			<Header>
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitcher />
				</div>
			</Header>

			<Main fixed>
				<div className="flex flex-wrap items-end justify-between gap-2">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Danh mục sản phẩm
						</h1>
						<p className="text-muted-foreground">
							Quản lý các loại sản phẩm cho thuê tại Harmony.
						</p>
					</div>
					<CategoriesPrimaryButtons />
				</div>

				<div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
					<div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
						<Input
							placeholder="Tìm danh mục..."
							className="h-9 w-40 lg:w-64"
							value={searchTerm}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchTerm(e.target.value)
							}
						/>
					</div>

					<div className="flex items-center gap-2">
						<Select
							value={sort}
							onValueChange={(v) => setSort(v as "asc" | "desc")}
						>
							<SelectTrigger className="w-16">
								<SelectValue>
									<SlidersHorizontal />
								</SelectValue>
							</SelectTrigger>
							<SelectContent align="end" alignItemWithTrigger={false}>
								<SelectGroup>
									<SelectItem value="asc">
										<div className="flex items-center gap-4">
											<ArrowUpAZ size={16} />
											<span>A → Z</span>
										</div>
									</SelectItem>
									<SelectItem value="desc">
										<div className="flex items-center gap-4">
											<ArrowDownAZ size={16} />
											<span>Z → A</span>
										</div>
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<Separator className="shadow-sm" />

				{/* List */}
				<div className="faded-bottom no-scrollbar overflow-auto pt-4 pb-16">
					<CategoriesList searchTerm={searchTerm} sort={sort} />
				</div>
			</Main>

			<CategoriesDialogs />
		</CategoriesProvider>
	);
}
