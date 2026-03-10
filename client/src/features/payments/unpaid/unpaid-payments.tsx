import { Orders } from "@/features/orders";
import { OrderStatus, PaymentStatus } from "@/gql/graphql";

export function UnpaidPayments() {
	return (
		<Orders
			title="Đơn chưa thanh toán"
			description="Danh sách đơn chưa tất toán hoặc mới chỉ đặt cọc."
			statuses={[
				OrderStatus.Pending,
				OrderStatus.Confirmed,
				OrderStatus.PickedUp,
				OrderStatus.Returned,
			]}
			paymentStatuses={[PaymentStatus.Unpaid, PaymentStatus.Deposited]}
		/>
	);
}
