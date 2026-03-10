import {
	IconArrowRight,
	IconChevronRight,
	IconDeviceLaptop,
	IconMoon,
	IconSun,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useSearch } from "@/components/search-provider";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/hooks/use-theme";
import { sidebarData } from "./layout/data/sidebar-data";

export function CommandMenu() {
	const navigate = useNavigate();
	const { setTheme } = useTheme();
	const { open, setOpen } = useSearch();

	const runCommand = React.useCallback(
		(command: () => unknown) => {
			setOpen(false);
			command();
		},
		[setOpen],
	);

	return (
		<CommandDialog modal open={open} onOpenChange={setOpen}>
			<Command>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<ScrollArea className="h-72 pe-1">
						<CommandEmpty>Không có kết quả.</CommandEmpty>
						{sidebarData.navGroups.map((group) => (
							<CommandGroup key={group.title} heading={group.title}>
								{group.items.map((navItem, i) => {
									if (navItem.url)
										return (
											<CommandItem
												key={`${navItem.url}-${i}`}
												value={navItem.title}
												onSelect={() => {
													runCommand(() =>
														navigate({
															to: navItem.url,
														}),
													);
												}}
											>
												<div className="flex size-4 items-center justify-center">
													<IconArrowRight className="size-2 text-muted-foreground/80" />
												</div>
												{navItem.title}
											</CommandItem>
										);

									return navItem.items?.map((subItem, i) => (
										<CommandItem
											key={`${navItem.title}-${subItem.url}-${i}`}
											value={`${navItem.title}-${subItem.url}`}
											onSelect={() => {
												runCommand(() =>
													navigate({
														to: subItem.url,
													}),
												);
											}}
										>
											<div className="flex size-4 items-center justify-center">
												<IconArrowRight className="size-2 text-muted-foreground/80" />
											</div>
											{navItem.title} <IconChevronRight /> {subItem.title}
										</CommandItem>
									));
								})}
							</CommandGroup>
						))}
						<CommandSeparator />
						<CommandGroup heading="Chủ đề">
							<CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
								<IconSun /> <span>Sáng</span>
							</CommandItem>
							<CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
								<IconMoon className="scale-90" />
								<span>Tối</span>
							</CommandItem>
							<CommandItem onSelect={() => runCommand(() => setTheme("auto"))}>
								<IconDeviceLaptop />
								<span>Tự động</span>
							</CommandItem>
						</CommandGroup>
					</ScrollArea>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
