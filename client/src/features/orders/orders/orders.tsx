import { useApolloClient, useSubscription, useSuspenseQuery } from "@apollo/client/react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense, useEffect, useState, useTransition } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import type { OrderFragment, OrderStatus, PaymentStatus } from "@/gql/graphql";
import { useDebounce } from "@/hooks/use-debounce";
import { OrdersDialogs } from "../common/orders-dialogs";
import { OrdersProvider } from "../common/orders-provider";
import { ordersQuery } from "../graphql";
import { orderUpdatedSubscription } from "../../notifications/graphql";
import { OrdersTable } from "./orders-table";

interface OrdersProps {
	title?: string;
	description?: string;
	statuses?: OrderStatus[];
	paymentStatuses?: PaymentStatus[];
	data?: OrderFragment[];
}

function OrdersTableWrapper({
	statuses: initialStatuses,
	paymentStatuses: initialPaymentStatuses,
	data: manualData,
}: Pick<OrdersProps, "statuses" | "paymentStatuses" | "data">) {
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
	const [search, setSearch] = useState("");
	// querySearch is the state that actually triggers the suspenseful query
	const [querySearch, setQuerySearch] = useState("");

	const [statuses, setStatuses] = useState<OrderStatus[]>(
		initialStatuses || [],
	);
	const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>(
		initialPaymentStatuses || [],
	);
	const [isPending, startTransition] = useTransition();

	// Use standard useDebounce to get a debounced value of search
	const debouncedSearchValue = useDebounce(search, 500);

	// Sync debounced search to querySearch within a transition
	// This ensures React handles the suspense state concurrently (keeping old UI)
	useEffect(() => {
		startTransition(() => {
			setQuerySearch(debouncedSearchValue);
		});
	}, [debouncedSearchValue]);

	const { data: fetchedData } = useSuspenseQuery(ordersQuery, {
		variables: {
			statuses: statuses.length > 0 ? statuses : undefined,
			paymentStatuses: paymentStatuses.length > 0 ? paymentStatuses : undefined,
			search: querySearch || undefined,
			page: pagination.pageIndex + 1,
			pageSize: pagination.pageSize,
		},
	});

	const orders = manualData || fetchedData?.orders || [];
	const totalCount = manualData
		? manualData.length
		: fetchedData?.ordersCount || 0;

	const wrapTransition =
		<T,>(fn: (val: T) => void) =>
		(val: T) => {
			startTransition(() => {
				fn(val);
			});
		};

	return (
		<OrdersTable
			data={orders}
			totalCount={totalCount}
			pagination={pagination}
			onPaginationChange={wrapTransition(setPagination)}
			search={search}
			onSearchChange={setSearch} // search itself is immediate for UI responsiveness
			statuses={statuses}
			onStatusesChange={wrapTransition(setStatuses)}
			paymentStatuses={paymentStatuses}
			onPaymentStatusesChange={wrapTransition(setPaymentStatuses)}
			isPending={isPending}
		/>
	);
}

export function Orders({
	title = "Đơn hàng",
	description = "Quản lý và theo dõi các đơn đặt thuê sản phẩm.",
	statuses,
	paymentStatuses,
	data,
}: OrdersProps) {
	const client = useApolloClient();
	useSubscription(orderUpdatedSubscription, {
		onData: ({ data: subData }) => {
			console.log('[Orders] 🔔 Subscription onData fired:', subData);
			void client.refetchQueries({ include: [ordersQuery] });
		},
		onError: (err) => {
			console.error('[Orders] ❌ Subscription error:', err);
		},
	});
	console.log('[Orders] 📡 useSubscription mounted');

	return (
		<OrdersProvider>
			<Header />

			<Main fixed>
				<div className="flex flex-wrap items-end justify-between gap-2">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
						<p className="text-muted-foreground">{description}</p>
					</div>
					<div className="flex items-center gap-2">
						<Button
							className="rounded-full gap-2 px-6 shadow-md"
							nativeButton={false}
							render={<Link to="/orders/new" />}
						>
							<Plus className="h-4 w-4" />
							Tạo đơn mới
						</Button>
					</div>
				</div>
				<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
					<Suspense
						fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}
					>
						<OrdersTableWrapper
							statuses={statuses}
							paymentStatuses={paymentStatuses}
							data={data}
						/>
					</Suspense>
				</div>
			</Main>
			<OrdersDialogs />
		</OrdersProvider>
	);
}
