import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutProvider } from "../layout-provider";
import { SearchProvider } from "../search-provider";
import { AppSidebar } from "./app-sidebar";

type AppLayoutProps = {
	children?: React.ReactNode;
	defaultOpen?: boolean;
};

export function AppLayout({ children, defaultOpen = true }: AppLayoutProps) {
	return (
		<SearchProvider>
			<LayoutProvider>
				<SidebarProvider defaultOpen={defaultOpen}>
					<AppSidebar />
					<SidebarInset
						className={cn(
							"@container/content",
							"has-data-[layout=fixed]:h-svh",
							"peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
						)}
					>
						{children ?? <Outlet />}
					</SidebarInset>
				</SidebarProvider>
			</LayoutProvider>
		</SearchProvider>
	);
}
