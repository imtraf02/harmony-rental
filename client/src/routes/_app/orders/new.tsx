import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { OrderCreateForm } from "@/features/orders";

export const Route = createFileRoute("/_app/orders/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header>
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitcher />
				</div>
			</Header>
			<Main>
				<div className="mb-6">
					<div className="flex items-center text-sm text-muted-foreground mb-2">
						<Link
							to="/orders"
							className="hover:text-foreground transition-colors"
						>
							Đơn thuê
						</Link>
						<ChevronRight className="w-4 h-4 mx-1" />
						<span className="text-foreground">Tạo mới</span>
					</div>
					<h1 className="text-3xl font-bold tracking-tight">
						Tạo đơn thuê mới
					</h1>
					<p className="text-muted-foreground mt-1">
						Điền thông tin chi tiết để tạo hợp đồng thuê sản phẩm.
					</p>
				</div>
				<OrderCreateForm />
			</Main>
		</>
	);
}
