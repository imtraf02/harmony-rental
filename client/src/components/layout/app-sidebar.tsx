import { useLayout } from "@/components/layout-provider";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";

export function AppSidebar() {
	const { collapsible, variant } = useLayout();
	return (
		<Sidebar collapsible={collapsible} variant={variant}>
			<SidebarHeader></SidebarHeader>
			<SidebarContent>
				{sidebarData.navGroups.map((props) => (
					<NavGroup key={props.title} {...props} />
				))}
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
