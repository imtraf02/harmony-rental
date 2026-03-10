import { OrderStatus, PaymentStatus } from "@/gql/graphql";

type StatusConfig = {
	label: string;
	className: string;
};

const defaultStatusConfig: StatusConfig = {
	label: "Không xác định",
	className: "bg-gray-500/10 text-gray-500",
};

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
	[OrderStatus.Pending]: {
		label: "Chờ xác nhận",
		className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
	},
	[OrderStatus.Confirmed]: {
		label: "Đã xác nhận",
		className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
	},
	[OrderStatus.PickedUp]: {
		label: "Đã lấy hàng",
		className: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
	},
	[OrderStatus.Returned]: {
		label: "Đã trả hàng",
		className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
	},
	[OrderStatus.Cancelled]: {
		label: "Đã hủy",
		className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
	},
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
	[PaymentStatus.Unpaid]: {
		label: "Chưa thanh toán",
		className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
	},
	[PaymentStatus.Deposited]: {
		label: "Đã đặt cọc",
		className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
	},
	[PaymentStatus.Paid]: {
		label: "Đã thanh toán",
		className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
	},
};

export function getOrderStatusConfig(status: OrderStatus) {
	return ORDER_STATUS_CONFIG[status] ?? defaultStatusConfig;
}

export function getPaymentStatusConfig(status: PaymentStatus) {
	return PAYMENT_STATUS_CONFIG[status] ?? defaultStatusConfig;
}
