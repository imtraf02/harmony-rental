import { useSuspenseQuery } from "@apollo/client/react";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DatePickerField } from "@/components/date-picker-field";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { PAYMENT_HISTORY_QUERY } from "../graphql/queries";
import { type PaymentHistoryRow, PaymentsTable } from "./payments-table";

type PaymentHistoryResponse = {
	paymentHistory: PaymentHistoryRow[];
	paymentHistoryCount: number;
};

function toStartIso(date: string | null) {
	if (!date) return null;
	return new Date(`${date}T00:00:00`).toISOString();
}

function toEndIso(date: string | null) {
	if (!date) return null;
	return new Date(`${date}T23:59:59.999`).toISOString();
}

function PaymentsTableWrapper() {
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 12 });
	const [search, setSearch] = useState("");
	const [querySearch, setQuerySearch] = useState("");
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const debouncedSearch = useDebounce(search, 500);

	useEffect(() => {
		startTransition(() => {
			setQuerySearch(debouncedSearch);
		});
	}, [debouncedSearch]);

	const variables = useMemo(
		() => ({
			search: querySearch.trim() || undefined,
			startDate: toStartIso(startDate) ?? undefined,
			endDate: toEndIso(endDate) ?? undefined,
			page: pagination.pageIndex + 1,
			pageSize: pagination.pageSize,
		}),
		[
			querySearch,
			startDate,
			endDate,
			pagination.pageIndex,
			pagination.pageSize,
		],
	);

	const { data } = useSuspenseQuery<PaymentHistoryResponse>(
		PAYMENT_HISTORY_QUERY,
		{
			variables,
		},
	);

	const rows = data?.paymentHistory ?? [];
	const totalCount = data?.paymentHistoryCount ?? 0;

	const wrapTransition =
		<T,>(fn: (value: T) => void) =>
		(value: T) => {
			startTransition(() => {
				fn(value);
			});
		};

	return (
		<div className="flex flex-1 flex-col gap-4">
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
				<DatePickerField
					value={startDate}
					onChange={wrapTransition(setStartDate)}
					placeholder="Từ ngày"
					nullable
				/>
				<DatePickerField
					value={endDate}
					onChange={wrapTransition(setEndDate)}
					placeholder="Đến ngày"
					nullable
				/>
				<Button
					variant="outline"
					onClick={() => {
						startTransition(() => {
							setSearch("");
							setQuerySearch("");
							setStartDate(null);
							setEndDate(null);
							setPagination({
								pageIndex: 0,
								pageSize: pagination.pageSize,
							});
						});
					}}
				>
					Đặt lại bộ lọc
				</Button>
			</div>

			<PaymentsTable
				data={rows}
				totalCount={totalCount}
				pagination={pagination}
				onPaginationChange={wrapTransition(setPagination)}
				search={search}
				onSearchChange={setSearch}
				isPending={isPending}
			/>
		</div>
	);
}

export function Payments() {
	return (
		<>
			<Header />
			<Main>
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Lịch sử thu tiền
					</h1>
					<p className="text-muted-foreground">
						Theo dõi tất cả giao dịch thanh toán theo đơn hàng.
					</p>
				</div>
				<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
					<Suspense
						fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
					>
						<PaymentsTableWrapper />
					</Suspense>
				</div>
			</Main>
		</>
	);
}
