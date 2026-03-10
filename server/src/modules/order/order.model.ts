import { z } from "zod";
import { builder } from "../../builder";
import { OrderStatus, PaymentStatus } from "../../generated/prisma/enums";
import { CreateCustomerInput } from "../customer/customer.model";

export const OrderStatusType = builder.enumType("OrderStatus", {
	values: Object.values(OrderStatus),
});

export const PaymentStatusType = builder.enumType("PaymentStatus", {
	values: Object.values(PaymentStatus),
});

export const DashboardTimePresetType = builder.enumType("DashboardTimePreset", {
	values: ["THIS_MONTH", "LAST_30_DAYS", "CUSTOM"] as const,
});

export const Payment = builder.prismaObject("Payment", {
	fields: (t) => ({
		id: t.exposeID("id"),
		amount: t.exposeInt("amount"),
		method: t.exposeString("method"),
		note: t.exposeString("note"),
		paidAt: t.expose("paidAt", { type: "DateTime" }),
		order: t.relation("order"),
	}),
});

export const OrderItem = builder.prismaObject("OrderItem", {
	fields: (t) => ({
		id: t.exposeID("id"),
		rentalPrice: t.exposeInt("rentalPrice"),
		deposit: t.exposeInt("deposit"),
		damageNote: t.exposeString("damageNote"),
		item: t.relation("item"),
		order: t.relation("order"),
	}),
});

export const Order = builder.prismaObject("Order", {
	fields: (t) => ({
		id: t.exposeID("id"),
		code: t.exposeString("code"),
		customer: t.relation("customer"),
		rentalDate: t.expose("rentalDate", { type: "DateTime" }),
		returnDate: t.expose("returnDate", { type: "DateTime" }),
		returnedAt: t.expose("returnedAt", { type: "DateTime", nullable: true }),
		eventDate: t.expose("eventDate", { type: "DateTime", nullable: true }),
		eventType: t.exposeString("eventType", { nullable: true }),
		totalAmount: t.exposeInt("totalAmount"),
		depositPaid: t.exposeInt("depositPaid"),
		balanceDue: t.exposeInt("balanceDue"),
		status: t.expose("status", { type: OrderStatusType }),
		paymentStatus: t.expose("paymentStatus", { type: PaymentStatusType }),
		lateFee: t.exposeInt("lateFee"),
		damageFee: t.exposeInt("damageFee"),
		note: t.exposeString("note"),
		items: t.relation("items"),
		payments: t.relation("payments"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
});

type DashboardChartPointShape = {
	date: string;
	orders: number;
	revenue: number;
};

type DashboardDueOrderShape = {
	id: string;
	code: string;
	customerName: string;
	customerPhone: string;
	rentalDate: Date;
	returnDate: Date;
	totalAmount: number;
	balanceDue: number;
	status: OrderStatus;
	daysToDue: number;
};

type DashboardAnalyticsShape = {
	rangeStart: Date;
	rangeEnd: Date;
	totalOrders: number;
	totalRevenue: number;
	depositCollected: number;
	outstandingBalance: number;
	activeOrders: number;
	chart: DashboardChartPointShape[];
	upcomingReturns: DashboardDueOrderShape[];
	overdueReturns: DashboardDueOrderShape[];
};

export const DashboardChartPoint = builder
	.objectRef<DashboardChartPointShape>("DashboardChartPoint")
	.implement({
		fields: (t) => ({
			date: t.exposeString("date"),
			orders: t.exposeInt("orders"),
			revenue: t.exposeInt("revenue"),
		}),
	});

export const DashboardDueOrder = builder
	.objectRef<DashboardDueOrderShape>("DashboardDueOrder")
	.implement({
		fields: (t) => ({
			id: t.exposeID("id"),
			code: t.exposeString("code"),
			customerName: t.exposeString("customerName"),
			customerPhone: t.exposeString("customerPhone"),
			rentalDate: t.expose("rentalDate", { type: "DateTime" }),
			returnDate: t.expose("returnDate", { type: "DateTime" }),
			totalAmount: t.exposeInt("totalAmount"),
			balanceDue: t.exposeInt("balanceDue"),
			status: t.expose("status", { type: OrderStatusType }),
			daysToDue: t.exposeInt("daysToDue"),
		}),
	});

export const DashboardAnalytics = builder
	.objectRef<DashboardAnalyticsShape>("DashboardAnalytics")
	.implement({
		fields: (t) => ({
			rangeStart: t.expose("rangeStart", { type: "DateTime" }),
			rangeEnd: t.expose("rangeEnd", { type: "DateTime" }),
			totalOrders: t.exposeInt("totalOrders"),
			totalRevenue: t.exposeInt("totalRevenue"),
			depositCollected: t.exposeInt("depositCollected"),
			outstandingBalance: t.exposeInt("outstandingBalance"),
			activeOrders: t.exposeInt("activeOrders"),
			chart: t.expose("chart", { type: [DashboardChartPoint] }),
			upcomingReturns: t.expose("upcomingReturns", {
				type: [DashboardDueOrder],
			}),
			overdueReturns: t.expose("overdueReturns", { type: [DashboardDueOrder] }),
		}),
	});

export const CreateOrderItemInput = builder.inputType("CreateOrderItemInput", {
	fields: (t) => ({
		itemId: t.string({
			required: true,
			validate: z.uuid("ID item không hợp lệ"),
		}),
		rentalPrice: t.int({
			required: true,
			validate: z.number().int().min(0, "Giá thuê phải >= 0"),
		}),
		deposit: t.int({
			required: true,
			validate: z.number().int().min(0, "Tiền cọc phải >= 0"),
		}),
	}),
});

export const UpdateOrderItemInput = builder.inputType("UpdateOrderItemInput", {
	fields: (t) => ({
		id: t.string(),
		itemId: t.string(),
		rentalPrice: t.int(),
		deposit: t.int(),
		damageNote: t.string(),
	}),
});

export const CreateOrderInput = builder.inputType("CreateOrderInput", {
	fields: (t) => ({
		customerId: t.string(),
		customer: t.field({ type: CreateCustomerInput }),
		rentalDate: t.field({ type: "DateTime", required: true }),
		returnDate: t.field({ type: "DateTime", required: true }),
		eventDate: t.field({ type: "DateTime" }),
		eventType: t.string(),
		totalAmount: t.int({ required: true }),
		depositPaid: t.int({
			required: true,
			validate: z.number().int().min(0, "Tiền cọc phải >= 0"),
		}),
		note: t.string({
			validate: z.string().max(1000, "Ghi chú tối đa 1000 ký tự"),
		}),
		items: t.field({ type: [CreateOrderItemInput], required: true }),
	}),
	validate: z
		.object({
			customerId: z.string().optional().nullable(),
			customer: z.any().optional().nullable(),
			rentalDate: z.date({
				message: "Ngày thuê không hợp lệ",
			}),
			returnDate: z.date({
				message: "Ngày trả không hợp lệ",
			}),
			eventDate: z.date().optional().nullable(),
			eventType: z.string().optional().nullable(),
			totalAmount: z.number().int(),
			depositPaid: z.number().int().min(0, "Tiền cọc phải >= 0"),
			note: z.string().optional().nullable(),
			items: z.array(z.any()).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
		})
		.refine((data) => data.returnDate >= data.rentalDate, {
			message: "Ngày trả phải sau hoặc bằng ngày thuê",
			path: ["returnDate"],
		})
		.refine((data) => data.customerId || data.customer, {
			message: "Vui lòng chọn hoặc nhập thông tin khách hàng",
		}),
});

export const UpdateOrderInput = builder.inputType("UpdateOrderInput", {
	fields: (t) => ({
		rentalDate: t.field({ type: "DateTime", required: false }),
		returnDate: t.field({ type: "DateTime", required: false }),
		returnedAt: t.field({ type: "DateTime", required: false }),
		eventDate: t.field({ type: "DateTime", required: false }),
		eventType: t.string(),
		totalAmount: t.int(),
		depositPaid: t.int({
			validate: z.number().int().min(0, "Tiền cọc phải >= 0"),
		}),
		lateFee: t.int({
			validate: z.number().int().min(0, "Phí trễ phải >= 0"),
		}),
		damageFee: t.int({
			validate: z.number().int().min(0, "Phí hư hại phải >= 0"),
		}),
		note: t.string({
			validate: z.string().max(1000, "Ghi chú tối đa 1000 ký tự"),
		}),
		status: t.field({ type: OrderStatusType }),
	}),
});

export const RecordOrderPaymentInput = builder.inputType(
	"RecordOrderPaymentInput",
	{
		fields: (t) => ({
			orderId: t.string({
				required: true,
				validate: z.uuid("ID đơn hàng không hợp lệ"),
			}),
			amount: t.int({ required: true }),
			method: t.string({
				required: true,
				validate: z
					.string()
					.min(1, "Phương thức thanh toán không được để trống"),
			}),
			note: t.string({
				validate: z.string().min(10, "Ghi chú cần ít nhất 10 ký tự"),
			}),
			paidAt: t.field({ type: "DateTime" }),
		}),
	},
);
