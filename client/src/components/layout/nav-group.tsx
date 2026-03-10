import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import type {
	NavCollapsible,
	NavGroup as NavGroupProps,
	NavItem,
	NavLink,
} from "./types";

export function NavGroup({ title, items }: NavGroupProps) {
	const { state, isMobile } = useSidebar();
	const href = useLocation({ select: (location) => location.href });

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					if (!item.items)
						return <SidebarMenuLink key={item.title} item={item} href={href} />;

					if (state === "collapsed" && !isMobile)
						return (
							<SidebarMenuCollapsedDropdown
								key={item.title}
								item={item}
								href={href}
							/>
						);

					return (
						<SidebarMenuCollapsible key={item.title} item={item} href={href} />
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
	const { setOpenMobile } = useSidebar();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				isActive={checkIsActive(href, item)}
				tooltip={item.title}
				render={
					<Link to={item.url} onClick={() => setOpenMobile(false)}>
						{item.icon && <item.icon />}
						<span>{item.title}</span>
					</Link>
				}
			></SidebarMenuButton>
		</SidebarMenuItem>
	);
}

function SidebarMenuCollapsible({
	item,
	href,
}: {
	item: NavCollapsible;
	href: string;
}) {
	const { setOpenMobile } = useSidebar();
	return (
		<Collapsible
			defaultOpen={checkIsActive(href, item, true)}
			render={
				<SidebarMenuItem>
					<CollapsibleTrigger
						render={
							<SidebarMenuButton className="group">
								{item.icon && <item.icon />}
								<span>{item.title}</span>
								<ChevronRight className="ms-auto transition-transform duration-200 group-data-panel-open:rotate-90 rtl:rotate-180" />
							</SidebarMenuButton>
						}
					/>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.items.map((subItem) => (
								<SidebarMenuSubItem key={subItem.title}>
									<SidebarMenuSubButton
										isActive={checkIsActive(href, subItem)}
										render={
											<Link
												to={subItem.url}
												onClick={() => setOpenMobile(false)}
											>
												{subItem.icon && <subItem.icon />}
												<span>{subItem.title}</span>
											</Link>
										}
									/>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			}
		/>
	);
}

function SidebarMenuCollapsedDropdown({
	item,
	href,
}: {
	item: NavCollapsible;
	href: string;
}) {
	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={(props) => (
						<SidebarMenuButton {...props} isActive={checkIsActive(href, item)}>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
							<ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarMenuButton>
					)}
				/>
				<DropdownMenuContent side="right" align="start" sideOffset={4}>
					{item.items.map((sub) => (
						<DropdownMenuItem
							key={`${sub.title}-${sub.url}`}
							render={
								<Link
									to={sub.url}
									className={checkIsActive(href, sub) ? "bg-secondary" : ""}
								/>
							}
						>
							{sub.icon && <sub.icon />}
							<span className="max-w-52 text-wrap">{sub.title}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
	const cleanHref = href.split("?")[0];
	return (
		cleanHref === item.url ||
		!!item?.items?.some((i) => i.url === cleanHref) ||
		(mainNav &&
			!!item?.url &&
			href.split("/")[1] !== "" &&
			href.split("/")[1] === item.url.split("/")[1])
	);
}
