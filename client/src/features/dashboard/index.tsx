import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { DatePickerField } from "@/components/date-picker-field";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/gql/graphql";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { ReturnsDeadlineCards } from "./components/returns-deadline-cards";
import { SectionCards } from "./components/section-cards";
import { DASHBOARD_ANALYTICS_QUERY } from "./graphql/queries";

type TimePreset = "THIS_MONTH" | "LAST_30_DAYS" | "CUSTOM";

const timePresetItems: { label: string; value: TimePreset }[] = [
	{ label: "Tháng này", value: "THIS_MONTH" },
	{ label: "30 ngày gần đây", value: "LAST_30_DAYS" },
	{ label: "Tùy chỉnh", value: "CUSTOM" },
];

type DashboardAnalyticsResponse = {
	dashboardAnalytics: {
		rangeStart: string;
		rangeEnd: string;
		totalOrders: number;
		totalRevenue: number;
		depositCollected: number;
		outstandingBalance: number;
		activeOrders: number;
		chart: { date: string; orders: number; revenue: number }[];
		upcomingReturns: {
			id: string;
			code: string;
			customerName: string;
			customerPhone: string;
			returnDate: string;
			totalAmount: number;
			balanceDue: number;
			status: OrderStatus;
			daysToDue: number;
		}[];
		overdueReturns: {
			id: string;
			code: string;
			customerName: string;
			customerPhone: string;
			returnDate: string;
			totalAmount: number;
			balanceDue: number;
			status: OrderStatus;
			daysToDue: number;
		}[];
	};
};

function toStartOfDayIso(dateValue: string) {
	return new Date(`${dateValue}T00:00:00`).toISOString();
}

function toEndOfDayIso(dateValue: string) {
	return new Date(`${dateValue}T23:59:59.999`).toISOString();
}

export function Dashboard() {
	const [preset, setPreset] = useState<TimePreset>("THIS_MONTH");
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);

	const variables = useMemo(() => {
		const isCustom = preset === "CUSTOM";

		return {
			preset,
			startDate: isCustom && startDate ? toStartOfDayIso(startDate) : null,
			endDate: isCustom && endDate ? toEndOfDayIso(endDate) : null,
			upcomingDays: 7,
		};
	}, [preset, startDate, endDate]);

	const { data, loading, refetch } = useQuery<DashboardAnalyticsResponse>(
		DASHBOARD_ANALYTICS_QUERY,
		{
			variables,
			skip: preset === "CUSTOM" && (!startDate || !endDate),
			fetchPolicy: "cache-and-network",
		},
	);

	const analytics = data?.dashboardAnalytics;

	return (
		<>
			<Header />
			<Main className="flex flex-1 flex-col gap-4 sm:gap-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Bảng điều khiển
						</h1>
						<p className="text-sm text-muted-foreground">
							Phân tích dữ liệu đơn hàng theo mốc thời gian và tiến độ trả đồ.
						</p>
					</div>

					<div className="flex flex-wrap items-end gap-2">
						<div className="w-full min-w-44 sm:w-auto">
							<Select
								items={timePresetItems}
								value={preset}
								onValueChange={(value) => setPreset(value as TimePreset)}
							>
								<SelectTrigger
									className="w-full sm:w-44"
									aria-label="Mốc thời gian"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Mốc thời gian</SelectLabel>
										{timePresetItems.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						{preset === "CUSTOM" && (
							<>
								<div className="w-full sm:w-40">
									<DatePickerField
										value={startDate}
										onChange={setStartDate}
										placeholder="Từ ngày"
									/>
								</div>
								<div className="w-full sm:w-40">
									<DatePickerField
										value={endDate}
										onChange={setEndDate}
										placeholder="Đến ngày"
									/>
								</div>
								<Button
									variant="outline"
									onClick={() => {
										if (startDate && endDate) {
											void refetch();
										}
									}}
								>
									Áp dụng
								</Button>
							</>
						)}
					</div>
				</div>

				<SectionCards
					totalRevenue={analytics?.totalRevenue ?? 0}
					depositCollected={analytics?.depositCollected ?? 0}
					totalOrders={analytics?.totalOrders ?? 0}
					activeOrders={analytics?.activeOrders ?? 0}
					completedOrders={Math.max(
						(analytics?.totalOrders ?? 0) - (analytics?.activeOrders ?? 0),
						0,
					)}
					outstandingBalance={analytics?.outstandingBalance ?? 0}
				/>

				<ChartAreaInteractive data={analytics?.chart ?? []} loading={loading} />

				<ReturnsDeadlineCards
					upcomingReturns={analytics?.upcomingReturns ?? []}
					overdueReturns={analytics?.overdueReturns ?? []}
				/>
			</Main>
		</>
	);
}
