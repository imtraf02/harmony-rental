import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductsDialogs } from "../common/products-dialogs";
import { ProductsProvider, useProducts } from "../common/products-provider";
import { ProductsList } from "./products-list";

function ProductsHeaderButtons() {
	const { setOpen } = useProducts();
	return (
		<Button
			className="gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
			onClick={() => setOpen("create")}
		>
			<IconPlus className="h-4 w-4" />
			Thêm sản phẩm
		</Button>
	);
}

export function Products() {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearch = useDebounce(searchTerm, 500);

	return (
		<ProductsProvider>
			<Header />

			<Main fixed>
				<div className="flex flex-wrap items-end justify-between gap-2">
					<div>
						<h1 className="text-2xl font-extrabold tracking-tight">
							Danh mục sản phẩm
						</h1>
						<p className="text-muted-foreground">
							Quản lý các loại sản phẩm, biến thể và cấu hình giá.
						</p>
					</div>
					<ProductsHeaderButtons />
				</div>

				<div className="flex items-center justify-between mt-4">
					<div className="relative w-full max-w-sm">
						<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm tên sản phẩm hoặc danh mục..."
							className="pl-9 h-10 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				<Separator className="my-4 opacity-50" />

				<div className="flex-1 overflow-auto min-h-0 no-scrollbar">
					<ProductsList searchTerm={debouncedSearch} />
				</div>
			</Main>
			<ProductsDialogs />
		</ProductsProvider>
	);
}
