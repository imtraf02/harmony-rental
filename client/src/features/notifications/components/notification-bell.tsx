import { useQuery, useSubscription } from "@apollo/client/react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatShortDate, formatVnd } from "@/lib/format";
import { useSettingsStore } from "@/stores/settings";
import { NotificationSettings } from "./notification-settings";
import { Settings } from "lucide-react";
import { orderUpdatedSubscription, upcomingReturnsQuery } from "../graphql";

export function NotificationBell() {
	const { dueSoonDays } = useSettingsStore();

	const { data, loading, refetch } = useQuery(upcomingReturnsQuery, {
		variables: { days: dueSoonDays },
	});

	useSubscription(orderUpdatedSubscription, {
		onData: ({ data: subData }) => {
			console.log("[NotificationBell] 🔔 Subscription onData fired:", subData);
			void refetch();
		},
		onError: (err) => {
			console.error("[NotificationBell] ❌ Subscription error:", err);
		},
	});

	const notifications = data?.upcomingReturns ?? [];
	const count = notifications.length;

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="relative scale-95 rounded-full"
						aria-label="Thông báo"
					>
						<Bell className="size-[1.2rem]" />
						{count > 0 && (
							<Badge
								variant="destructive"
								className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
							>
								{count > 99 ? "99+" : count}
							</Badge>
						)}
					</Button>
				}
			></PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="flex items-center justify-between p-4 pb-2">
					<h4 className="text-sm font-semibold">Thông báo trả đồ</h4>
					<div className="flex items-center gap-2">
						{count > 0 && (
							<Badge variant="outline" className="text-[10px]">
								{count} đơn hàng
							</Badge>
						)}
						<Popover>
							<PopoverTrigger
								render={
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										aria-label="Cài đặt thông báo"
									>
										<Settings className="size-4" />
									</Button>
								}
							/>
								<PopoverContent
									className="w-72 overflow-hidden rounded-2xl p-0 shadow-2xl"
									align="end"
									side="left"
									sideOffset={10}
								>
									<div className="flex items-center gap-2 bg-muted/50 px-4 py-3">
										<Settings className="size-4 text-primary" />
										<h5 className="text-sm font-bold">Cài đặt thông báo</h5>
									</div>
									<div className="p-4">
										<NotificationSettings />
									</div>
								</PopoverContent>
						</Popover>
					</div>
				</div>
				<div className="px-4 pb-2 text-[10px] text-muted-foreground">
					Đang hiển thị đơn hàng hết hạn trong {dueSoonDays} ngày tới
				</div>
				<Separator />
				<ScrollArea className="h-80">
					{loading && (
						<div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
							Đang tải...
						</div>
					)}
					{!loading && count === 0 && (
						<div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
							Không có thông báo mới
						</div>
					)}
					{!loading && count > 0 && (
						<div className="flex flex-col">
							{notifications.map((notif) => (
								<Link
									key={notif.id}
									to="/orders/$id"
									params={{ id: notif.id }}
									className="flex flex-col gap-1 border-b p-4 text-sm transition-colors hover:bg-muted last:border-0"
								>
									<div className="flex items-center justify-between">
										<span className="font-bold">{notif.code}</span>
										<Badge
											variant={
												notif.daysToDue < 0 ? "destructive" : "secondary"
											}
											className="text-[10px] px-1 py-0"
										>
											{notif.daysToDue < 0
												? `Trễ ${Math.abs(notif.daysToDue)} ngày`
												: `Còn ${notif.daysToDue} ngày`}
										</Badge>
									</div>
									<div className="text-xs text-muted-foreground">
										{notif.customerName} - {notif.customerPhone}
									</div>
									<div className="mt-1 flex items-center justify-between text-[11px]">
										<span>Hạn: {formatShortDate(notif.returnDate)}</span>
										<span className="font-medium text-destructive">
											Nợ: {formatVnd(notif.balanceDue)}
										</span>
									</div>
								</Link>
							))}
						</div>
					)}
				</ScrollArea>
				<Separator />
				<div className="p-2 text-center">
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-xs"
						nativeButton={false}
						render={<Link to="/" />}
					>
						Xem bảng điều khiển
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
