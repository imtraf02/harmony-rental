import { createFileRoute } from "@tanstack/react-router";

import { Orders } from "@/features/orders";
import { OrderStatus } from "@/gql/graphql";

export const Route = createFileRoute("/_app/orders/active")({
	component: ActiveOrdersPage,
});

function ActiveOrdersPage() {
	return (
		<Orders 
			title="Đơn hàng đang thuê" 
			description="Danh sách các đơn hàng đã được giao cho khách hoặc đã xác nhận."
			statuses={[OrderStatus.Confirmed, OrderStatus.PickedUp]} 
		/>
	);
}
