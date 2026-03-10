import {
	IconCash,
	IconCategory,
	IconDashboard,
	IconFileText,
	IconPackage,
	IconShirt,
	IconTool,
	IconUsers,
} from "@tabler/icons-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
	navGroups: [
		{
			title: "Tổng quan",
			items: [
				{
					title: "Dashboard",
					url: "/",
					icon: IconDashboard,
				},
			],
		},
		{
			title: "Quản lý thuê",
			items: [
				{
					title: "Đơn thuê",
					icon: IconFileText,
					items: [
						{ title: "Tất cả đơn", url: "/orders" },
						{ title: "Tạo đơn mới", url: "/orders/new" },
					],
				},
				{
					title: "Khách hàng",
					icon: IconUsers,
					items: [
						{ title: "Danh sách", url: "/customers" },
						{ title: "Thêm khách hàng", url: "/customers/new" },
					],
				},
			],
		},
		{
			title: "Kho sản phẩm",
			items: [
				{
					title: "Sản phẩm",
					icon: IconShirt,
					items: [
						{ title: "Danh sách", url: "/products" },
						{ title: "Thêm sản phẩm", url: "/products/new" },
					],
				},
				{
					title: "Kho hàng",
					url: "/inventory",
					icon: IconPackage,
				},
				{
					title: "Danh mục",
					url: "/categories",
					icon: IconCategory,
				},
			],
		},
		{
			title: "Tài chính",
			items: [
				{
					title: "Thanh toán",
					icon: IconCash,
					items: [
						{ title: "Lịch sử thu tiền", url: "/payments" },
						{ title: "Chưa thanh toán", url: "/payments/unpaid" },
					],
				},
			],
		},
		{
			title: "Vận hành",
			items: [
				{
					title: "Bảo trì / Giặt ủi",
					url: "/maintenances",
					icon: IconTool,
				},
			],
		},
	],
};
