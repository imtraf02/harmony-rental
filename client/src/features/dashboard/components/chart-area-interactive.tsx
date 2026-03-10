import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type ChartPoint = {
	date: string;
	orders: number;
	revenue: number;
};

type ChartAreaInteractiveProps = {
	data: ChartPoint[];
	loading?: boolean;
};

const chartConfig = {
	revenue: {
		label: "Doanh thu",
		color: "hsl(var(--chart-1))",
	},
	orders: {
		label: "Đơn hàng",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

function formatVnd(value: number) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);
}

export function ChartAreaInteractive({
	data,
	loading,
}: ChartAreaInteractiveProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Phân tích theo thời gian</CardTitle>
				<CardDescription>
					Biểu đồ doanh thu và số đơn trong khoảng thời gian đã chọn
				</CardDescription>
			</CardHeader>
			<CardContent className="px-2 pt-2 sm:px-4 sm:pt-4">
				<ChartContainer config={chartConfig} className="h-[280px] w-full">
					<AreaChart data={data}>
						<defs>
							<linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-revenue)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-revenue)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-orders)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-orders)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={24}
							tickFormatter={(value) =>
								new Date(value).toLocaleDateString("vi-VN", {
									month: "short",
									day: "numeric",
								})
							}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) =>
										typeof value === "string"
											? new Date(value).toLocaleDateString("vi-VN", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})
											: ""
									}
									formatter={(value, name) => {
										if (name === "revenue") {
											return formatVnd(Number(value));
										}
										return Number(value).toLocaleString("vi-VN");
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="orders"
							type="natural"
							fill="url(#fillOrders)"
							stroke="var(--color-orders)"
							stackId="a"
						/>
						<Area
							dataKey="revenue"
							type="natural"
							fill="url(#fillRevenue)"
							stroke="var(--color-revenue)"
							stackId="b"
						/>
					</AreaChart>
				</ChartContainer>
				{loading && (
					<p className="px-2 pt-2 text-xs text-muted-foreground">
						Đang tải dữ liệu...
					</p>
				)}
			</CardContent>
		</Card>
	);
}
