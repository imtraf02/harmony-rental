import { useSuspenseQuery } from "@apollo/client/react";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomersDialogs } from "../common/customers-dialogs";
import { CustomersProvider } from "../common/customers-provider";
import { CustomersTable } from "./customers-table";
import { customersQuery } from "../graphql";

function CustomersPrimaryButtons() {
	return (
		<Link
			to="/customers/new"
			className={cn(buttonVariants({ variant: "default" }))}
		>
			<IconPlus className="mr-2 h-4 w-4" />
			Thêm khách hàng
		</Link>
	);
}

function CustomersTableWrapper() {
	const { data } = useSuspenseQuery(customersQuery);
	return <CustomersTable data={data?.customers ?? []} />;
}

export function Customers() {
	return (
		<CustomersProvider>
			<Header>
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitcher />
				</div>
			</Header>

			<Main fixed>
				<div className="flex flex-wrap items-end justify-between gap-2">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Khách hàng</h1>
						<p className="text-muted-foreground">
							Danh sách và thông tin khách hàng.
						</p>
					</div>
					<CustomersPrimaryButtons />
				</div>
				<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
					<Suspense fallback={<div>Đang tải dữ liệu khách hàng...</div>}>
						<CustomersTableWrapper />
					</Suspense>
				</div>
			</Main>
			<CustomersDialogs />
		</CustomersProvider>
	);
}
