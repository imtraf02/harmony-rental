import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type SectionCardsProps = {
	totalRevenue: number;
	depositCollected: number;
	totalOrders: number;
	activeOrders: number;
	completedOrders: number;
	outstandingBalance: number;
};

import { formatVnd } from "@/lib/format";

export function SectionCards({
	totalRevenue,
	depositCollected,
	totalOrders,
	activeOrders,
	completedOrders,
	outstandingBalance,
}: SectionCardsProps) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			<Card>
				<CardHeader>
					<CardDescription>Số đơn hàng</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums">
						{totalOrders}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							Đơn
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex items-center gap-2 font-medium">
						Lượng đơn phát sinh <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">Bao gồm đơn chưa hủy</div>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Đơn đang hoạt động</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums">
						{activeOrders}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							Đang mở
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex items-center gap-2 font-medium">
						Chưa trả hoặc chưa huỷ <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Chờ xác nhận, đã xác nhận, đã lấy hàng
					</div>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Đơn đã hoàn thành</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums">
						{completedOrders}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							Hoàn tất
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex items-center gap-2 font-medium">
						Đơn đã trả hàng <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Trong bộ lọc thời gian hiện tại
					</div>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Doanh thu trong kỳ</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums">
						{formatVnd(totalRevenue)}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							Doanh thu
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex items-center gap-2 font-medium">
						Tổng giá trị đơn hàng <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Theo bộ lọc thời gian hiện tại
					</div>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Đặt cọc đã thu</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums">
						{formatVnd(depositCollected)}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							Tiền cọc
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex items-center gap-2 font-medium">
						Khoản khách đã đặt cọc <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Chỉ tính các đơn chưa hoàn thành trong kỳ
					</div>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Công nợ còn lại</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums">
						{formatVnd(outstandingBalance)}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingDown />
							Cần thu
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex items-center gap-2 font-medium">
						Dư nợ trong kỳ <IconTrendingDown className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Tổng số tiền còn nợ của các đơn trong kỳ
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
