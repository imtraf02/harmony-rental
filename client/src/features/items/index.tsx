import { IconCheckbox, IconTool, IconTruckDelivery } from "@tabler/icons-react";
import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { FacetedFilter } from "@/components/ui/faceted-filter";
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
import { ItemStatus } from "@/gql/graphql";
import { ItemsDialogs } from "./components/items-dialogs";
import { ItemsList } from "./components/items-list";
import { ItemsPrimaryButtons } from "./components/items-primary-buttons";
import { ItemsProvider } from "./components/items-provider";

const statusOptions = [
	{ value: ItemStatus.Available, label: "Sẵn sàng", icon: IconCheckbox },
	{ value: ItemStatus.Rented, label: "Đang thuê", icon: IconTruckDelivery },
	{ value: ItemStatus.Maintenance, label: "Bảo trì", icon: IconTool },
];

export function Items() {
	const [searchTerm, setSearchTerm] = useState("");
	const [sort, setSort] = useState<"asc" | "desc">("asc");
	const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
		new Set(),
	);

	return (
		<ItemsProvider>
			<Header>
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitcher />
				</div>
			</Header>

			<Main fixed>
				<div className="flex flex-wrap items-end justify-between gap-2">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Sản phẩm cho thuê
						</h1>
						<p className="text-muted-foreground">
							Quản lý kho sản phẩm cho thuê tại Harmony.
						</p>
					</div>
					<ItemsPrimaryButtons />
				</div>

				<div className="flex items-end justify-between sm:items-center mt-2">
					<div className="flex flex-col gap-4 sm:flex-row">
						<Input
							placeholder="Tìm sản phẩm..."
							className="h-9 w-40 lg:w-64"
							value={searchTerm}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchTerm(e.target.value)
							}
						/>
						<FacetedFilter
							title="Trạng thái"
							options={statusOptions}
							selectedValues={selectedStatuses}
							onFilterChange={setSelectedStatuses}
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

				<Separator className="my-4 shadow-sm" />

				{/* List */}
				<div className="faded-bottom no-scrollbar overflow-auto pb-16">
					<ItemsList
						searchTerm={searchTerm}
						sort={sort}
						selectedStatuses={selectedStatuses}
					/>
				</div>
			</Main>

			<ItemsDialogs />
		</ItemsProvider>
	);
}
