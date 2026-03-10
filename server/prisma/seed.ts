import { prisma } from "../src/db";
import {
	ItemStatus,
	OrderStatus,
	PaymentStatus,
} from "../src/generated/prisma/client";

// Helpers
const daysFromNow = (days: number) => new Date(Date.now() + 86400000 * days);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calculateRentalDays(rentalDate: Date, returnDate: Date) {
	const start = startOfDay(rentalDate).getTime();
	const end = startOfDay(returnDate).getTime();
	const days = Math.ceil((end - start) / MS_PER_DAY);
	return Math.max(1, days);
}

function resolvePaymentStatus(
	totalPaid: number,
	balanceDue: number,
): PaymentStatus {
	if (balanceDue <= 0) return PaymentStatus.PAID;
	if (totalPaid > 0) return PaymentStatus.DEPOSITED;
	return PaymentStatus.UNPAID;
}

async function main() {
	console.log("🗑️  Xóa dữ liệu cũ...");

	// Xóa theo thứ tự để tránh lỗi foreign key
	await prisma.payment.deleteMany();
	await prisma.maintenance.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.item.deleteMany();
	await prisma.productVariant.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();
	await prisma.customer.deleteMany();

	console.log("✅ Đã xóa xong dữ liệu cũ.");
	console.log("🌱 Bắt đầu seed dữ liệu với cấu trúc Product/Variant/Item...");

	// ==================== CATEGORIES ====================
	const [catAoDai, catVest, catVayCuoi, catPhuKien] = await Promise.all([
		prisma.category.create({
			data: {
				name: "Áo dài",
				description:
					"Áo dài truyền thống Việt Nam, phù hợp cho lễ cưới, lễ hội, sự kiện văn hóa",
			},
		}),
		prisma.category.create({
			data: {
				name: "Vest - Comple",
				description:
					"Bộ vest, comple nam dành cho chú rể, dự tiệc, sự kiện trang trọng",
			},
		}),
		prisma.category.create({
			data: {
				name: "Váy cưới",
				description:
					"Váy cưới trắng và màu dành cho cô dâu, chụp ảnh cưới, lễ cưới",
			},
		}),
		prisma.category.create({
			data: {
				name: "Phụ kiện",
				description:
					"Vương miện, khăn voan, găng tay, cài tóc và các phụ kiện đám cưới",
			},
		}),
	]);

	// ==================== PRODUCTS ====================
	const [
		prodAoDaiPhuong,
		prodAoDaiHoa,
		prodVestY,
		prodVestHanQuoc,
		prodVayCuoiXoe,
		prodVayCuoiDuoiCa,
		prodVuongMien,
	] = await Promise.all([
		prisma.product.create({
			data: {
				name: "Áo dài lụa thêu phượng",
				categoryId: catAoDai.id,
				description: "Áo dài lụa cao cấp thêu họa tiết phượng hoàng sang trọng",
			},
		}),
		prisma.product.create({
			data: {
				name: "Áo dài gấm hoa sen",
				categoryId: catAoDai.id,
				description: "Áo dài gấm truyền thống họa tiết hoa sen, màu sắc rực rỡ",
			},
		}),
		prisma.product.create({
			data: {
				name: "Vest Nam Công Sở Ý",
				categoryId: catVest.id,
				description:
					"Dáng slim fit, vải nhập khẩu Ý, phù hợp chú rể và dự tiệc",
			},
		}),
		prisma.product.create({
			data: {
				name: "Vest Nam Hàn Quốc",
				categoryId: catVest.id,
				description: "Thiết kế hiện đại phong cách Hàn Quốc, dáng regular fit",
			},
		}),
		prisma.product.create({
			data: {
				name: "Váy cưới xòe công chúa",
				categoryId: catVayCuoi.id,
				description: "Đính pha lê Swarovski, đuôi dài 2m, phù hợp lễ cưới lớn",
			},
		}),
		prisma.product.create({
			data: {
				name: "Váy cưới đuôi cá tôm",
				categoryId: catVayCuoi.id,
				description:
					"Ôm body tôn dáng, phần đuôi xòe nhẹ, thích hợp chụp ảnh ngoại cảnh",
			},
		}),
		prisma.product.create({
			data: {
				name: "Vương miện cô dâu đính đá",
				categoryId: catPhuKien.id,
				description:
					"Vương miện mạ vàng đính đá pha lê, phù hợp mọi phong cách",
			},
		}),
	]);

	// ==================== VARIANTS ====================

	// --- Áo dài lụa thêu phượng ---
	const [varAoDaiPhuongRedM, varAoDaiPhuongRedL, varAoDaiPhuongGoldM] =
		await Promise.all([
			prisma.productVariant.create({
				data: {
					productId: prodAoDaiPhuong.id,
					size: "M",
					color: "Đỏ",
					rentalPrice: 300000,
					deposit: 1000000,
				},
			}),
			prisma.productVariant.create({
				data: {
					productId: prodAoDaiPhuong.id,
					size: "L",
					color: "Đỏ",
					rentalPrice: 300000,
					deposit: 1000000,
				},
			}),
			prisma.productVariant.create({
				data: {
					productId: prodAoDaiPhuong.id,
					size: "M",
					color: "Vàng đồng",
					rentalPrice: 320000,
					deposit: 1000000,
				},
			}),
		]);

	// --- Áo dài gấm hoa sen ---
	const [varAoDaiHoaBluS, varAoDaiHoaBluM] = await Promise.all([
		prisma.productVariant.create({
			data: {
				productId: prodAoDaiHoa.id,
				size: "S",
				color: "Xanh lam",
				rentalPrice: 280000,
				deposit: 900000,
			},
		}),
		prisma.productVariant.create({
			data: {
				productId: prodAoDaiHoa.id,
				size: "M",
				color: "Xanh lam",
				rentalPrice: 280000,
				deposit: 900000,
			},
		}),
	]);

	// --- Vest Ý ---
	const [varVestYBlackL, varVestYNavyM, varVestYNavyL] = await Promise.all([
		prisma.productVariant.create({
			data: {
				productId: prodVestY.id,
				size: "L",
				color: "Đen",
				rentalPrice: 400000,
				deposit: 1500000,
			},
		}),
		prisma.productVariant.create({
			data: {
				productId: prodVestY.id,
				size: "M",
				color: "Xanh navy",
				rentalPrice: 400000,
				deposit: 1500000,
			},
		}),
		prisma.productVariant.create({
			data: {
				productId: prodVestY.id,
				size: "L",
				color: "Xanh navy",
				rentalPrice: 400000,
				deposit: 1500000,
			},
		}),
	]);

	// --- Vest Hàn Quốc ---
	const [varVestHQGrayM, varVestHQGrayL] = await Promise.all([
		prisma.productVariant.create({
			data: {
				productId: prodVestHanQuoc.id,
				size: "M",
				color: "Xám",
				rentalPrice: 350000,
				deposit: 1200000,
			},
		}),
		prisma.productVariant.create({
			data: {
				productId: prodVestHanQuoc.id,
				size: "L",
				color: "Xám",
				rentalPrice: 350000,
				deposit: 1200000,
			},
		}),
	]);

	// --- Váy cưới xòe ---
	const [varVayCuoiXoeWhiteS, varVayCuoiXoeWhiteM] = await Promise.all([
		prisma.productVariant.create({
			data: {
				productId: prodVayCuoiXoe.id,
				size: "S",
				color: "Trắng ngà",
				rentalPrice: 800000,
				deposit: 5000000,
			},
		}),
		prisma.productVariant.create({
			data: {
				productId: prodVayCuoiXoe.id,
				size: "M",
				color: "Trắng ngà",
				rentalPrice: 800000,
				deposit: 5000000,
			},
		}),
	]);

	// --- Váy cưới đuôi cá ---
	const [varVayDuoiCaWhiteS, varVayDuoiCaPinkS] = await Promise.all([
		prisma.productVariant.create({
			data: {
				productId: prodVayCuoiDuoiCa.id,
				size: "S",
				color: "Trắng tinh",
				rentalPrice: 700000,
				deposit: 4000000,
			},
		}),
		prisma.productVariant.create({
			data: {
				productId: prodVayCuoiDuoiCa.id,
				size: "S",
				color: "Hồng phấn",
				rentalPrice: 700000,
				deposit: 4000000,
			},
		}),
	]);

	// --- Vương miện ---
	const varVuongMienGold = await prisma.productVariant.create({
		data: {
			productId: prodVuongMien.id,
			size: "Free size",
			color: "Vàng",
			rentalPrice: 150000,
			deposit: 500000,
		},
	});
	const varVuongMienSilver = await prisma.productVariant.create({
		data: {
			productId: prodVuongMien.id,
			size: "Free size",
			color: "Bạc",
			rentalPrice: 150000,
			deposit: 500000,
		},
	});

	// ==================== ITEMS ====================
	const [
		itemAD_PM_R_M_01,
		_itemAD_PM_R_M_02,
		itemAD_PM_R_L_01,
		itemAD_PM_G_M_01,
		itemAD_HS_B_S_01,
		itemAD_HS_B_M_01,
		itemVT_Y_BL_L_01,
		itemVT_Y_BL_L_02,
		itemVT_Y_NV_M_01,
		_itemVT_Y_NV_L_01,
		itemVT_HQ_GR_M_01,
		itemVT_HQ_GR_L_01,
		itemVC_XO_WH_S_01,
		itemVC_XO_WH_M_01,
		itemVC_DC_WH_S_01,
		itemVC_DC_PK_S_01,
		itemVM_GO_01,
		itemVM_GO_02,
		itemVM_SI_01,
	] = await Promise.all([
		// Áo dài phượng - Đỏ M
		prisma.item.create({
			data: {
				code: "AD001-RM-01",
				variantId: varAoDaiPhuongRedM.id,
				status: ItemStatus.AVAILABLE,
				note: "Mới 100%",
			},
		}),
		prisma.item.create({
			data: {
				code: "AD001-RM-02",
				variantId: varAoDaiPhuongRedM.id,
				status: ItemStatus.RENTED,
				note: "Hơi sờn chỉ nhẹ ở tay",
			},
		}),
		// Áo dài phượng - Đỏ L
		prisma.item.create({
			data: {
				code: "AD001-RL-01",
				variantId: varAoDaiPhuongRedL.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Áo dài phượng - Vàng đồng M
		prisma.item.create({
			data: {
				code: "AD001-GM-01",
				variantId: varAoDaiPhuongGoldM.id,
				status: ItemStatus.AVAILABLE,
				note: "Mới nhập kho",
			},
		}),
		// Áo dài hoa sen - Xanh lam S
		prisma.item.create({
			data: {
				code: "AD002-BS-01",
				variantId: varAoDaiHoaBluS.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Áo dài hoa sen - Xanh lam M
		prisma.item.create({
			data: {
				code: "AD002-BM-01",
				variantId: varAoDaiHoaBluM.id,
				status: ItemStatus.MAINTENANCE,
				note: "Đang giặt hấp",
			},
		}),
		// Vest Ý - Đen L
		prisma.item.create({
			data: {
				code: "VT001-BL-01",
				variantId: varVestYBlackL.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		prisma.item.create({
			data: {
				code: "VT001-BL-02",
				variantId: varVestYBlackL.id,
				status: ItemStatus.MAINTENANCE,
				note: "Đang thay cúc",
			},
		}),
		// Vest Ý - Navy M
		prisma.item.create({
			data: {
				code: "VT001-NM-01",
				variantId: varVestYNavyM.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Vest Ý - Navy L
		prisma.item.create({
			data: {
				code: "VT001-NL-01",
				variantId: varVestYNavyL.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Vest HQ - Xám M
		prisma.item.create({
			data: {
				code: "VT002-GM-01",
				variantId: varVestHQGrayM.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Vest HQ - Xám L
		prisma.item.create({
			data: {
				code: "VT002-GL-01",
				variantId: varVestHQGrayL.id,
				status: ItemStatus.RENTED,
			},
		}),
		// Váy cưới xòe - Trắng ngà S
		prisma.item.create({
			data: {
				code: "VC001-WS-01",
				variantId: varVayCuoiXoeWhiteS.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Váy cưới xòe - Trắng ngà M
		prisma.item.create({
			data: {
				code: "VC001-WM-01",
				variantId: varVayCuoiXoeWhiteM.id,
				status: ItemStatus.AVAILABLE,
				note: "Mới 100%, chưa qua sử dụng",
			},
		}),
		// Váy cưới đuôi cá - Trắng S
		prisma.item.create({
			data: {
				code: "VC002-WS-01",
				variantId: varVayDuoiCaWhiteS.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Váy cưới đuôi cá - Hồng S
		prisma.item.create({
			data: {
				code: "VC002-PS-01",
				variantId: varVayDuoiCaPinkS.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Vương miện vàng
		prisma.item.create({
			data: {
				code: "VM001-GO-01",
				variantId: varVuongMienGold.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		prisma.item.create({
			data: {
				code: "VM001-GO-02",
				variantId: varVuongMienGold.id,
				status: ItemStatus.AVAILABLE,
			},
		}),
		// Vương miện bạc
		prisma.item.create({
			data: {
				code: "VM001-SI-01",
				variantId: varVuongMienSilver.id,
				status: ItemStatus.RENTED,
			},
		}),
	]);

	// Bổ sung thêm nhiều item mẫu để test tồn kho / lọc / tìm kiếm
	await prisma.item.createMany({
		data: [
			{
				code: "AD001-RM-03",
				variantId: varAoDaiPhuongRedM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD001-RM-04",
				variantId: varAoDaiPhuongRedM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD001-RL-02",
				variantId: varAoDaiPhuongRedL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD001-RL-03",
				variantId: varAoDaiPhuongRedL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD001-GM-02",
				variantId: varAoDaiPhuongGoldM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD001-GM-03",
				variantId: varAoDaiPhuongGoldM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD002-BS-02",
				variantId: varAoDaiHoaBluS.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD002-BS-03",
				variantId: varAoDaiHoaBluS.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD002-BM-02",
				variantId: varAoDaiHoaBluM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "AD002-BM-03",
				variantId: varAoDaiHoaBluM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT001-BL-03",
				variantId: varVestYBlackL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT001-BL-04",
				variantId: varVestYBlackL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT001-NM-02",
				variantId: varVestYNavyM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT001-NM-03",
				variantId: varVestYNavyM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT001-NL-02",
				variantId: varVestYNavyL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT001-NL-03",
				variantId: varVestYNavyL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT002-GM-02",
				variantId: varVestHQGrayM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VT002-GL-02",
				variantId: varVestHQGrayL.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VC001-WS-02",
				variantId: varVayCuoiXoeWhiteS.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VC001-WM-02",
				variantId: varVayCuoiXoeWhiteM.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VC002-WS-02",
				variantId: varVayDuoiCaWhiteS.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VC002-PS-02",
				variantId: varVayDuoiCaPinkS.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VM001-GO-03",
				variantId: varVuongMienGold.id,
				status: ItemStatus.AVAILABLE,
			},
			{
				code: "VM001-SI-02",
				variantId: varVuongMienSilver.id,
				status: ItemStatus.AVAILABLE,
			},
		],
	});

	// ==================== CUSTOMERS ====================
	const [cusLan, cusMai, cusTuan, cusHoa, cusKhanh, cusVy, cusPhong, cusTram] =
		await Promise.all([
			prisma.customer.create({
				data: {
					name: "Nguyễn Thị Lan",
					phone: "0901234567",
					address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Trần Thị Mai",
					phone: "0912345678",
					address: "45 Lê Lợi, Quận 1, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Lê Văn Tuấn",
					phone: "0923456789",
					address: "78 Hai Bà Trưng, Quận 3, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Phạm Thị Hoa",
					phone: "0934567890",
					address: "12 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Đặng Minh Khánh",
					phone: "0945678912",
					address: "220 Nguyễn Tri Phương, Quận 10, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Bùi Ngọc Vy",
					phone: "0956789123",
					address: "15 Trần Não, TP. Thủ Đức, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Võ Thanh Phong",
					phone: "0967891234",
					address: "8 Pasteur, Quận 1, TP.HCM",
				},
			}),
			prisma.customer.create({
				data: {
					name: "Lý Bảo Trâm",
					phone: "0978912345",
					address: "41 Hoàng Văn Thụ, Phú Nhuận, TP.HCM",
				},
			}),
		]);

	// ==================== ORDERS ====================

	// Đơn 1: Chị Lan - áo dài + vest, đám cưới, đã xác nhận, đã đặt cọc
	const ord1 = await prisma.order.create({
		data: {
			code: "ORD-001",
			customerId: cusLan.id,
			rentalDate: daysFromNow(0),
			returnDate: daysFromNow(3),
			eventDate: daysFromNow(1),
			eventType: "Lễ cưới",
			totalAmount: 700000,
			depositPaid: 2500000,
			balanceDue: 700000,
			status: OrderStatus.CONFIRMED,
			paymentStatus: PaymentStatus.DEPOSITED,
			note: "Cô dâu cần mặc thử trước 1 ngày",
			items: {
				create: [
					{
						itemId: itemAD_PM_R_M_01.id,
						rentalPrice: 300000,
						deposit: 1000000,
					},
					{
						itemId: itemVT_Y_BL_L_01.id,
						rentalPrice: 400000,
						deposit: 1500000,
					},
				],
			},
		},
	});

	// Đơn 2: Chị Mai - váy cưới xòe + vương miện, đám cưới sắp tới, chờ xác nhận
	const ord2 = await prisma.order.create({
		data: {
			code: "ORD-002",
			customerId: cusMai.id,
			rentalDate: daysFromNow(5),
			returnDate: daysFromNow(7),
			eventDate: daysFromNow(6),
			eventType: "Chụp ảnh cưới",
			totalAmount: 950000,
			depositPaid: 5500000,
			balanceDue: 950000,
			status: OrderStatus.PENDING,
			paymentStatus: PaymentStatus.DEPOSITED,
			items: {
				create: [
					{
						itemId: itemVC_XO_WH_S_01.id,
						rentalPrice: 800000,
						deposit: 5000000,
					},
					{ itemId: itemVM_GO_01.id, rentalPrice: 150000, deposit: 500000 },
				],
			},
		},
	});

	// Đơn 3: Anh Tuấn - vest HQ, đã trả đồ, đã thanh toán đủ, có phí trễ nhỏ
	const ord3 = await prisma.order.create({
		data: {
			code: "ORD-003",
			customerId: cusTuan.id,
			rentalDate: daysFromNow(-7),
			returnDate: daysFromNow(-4),
			returnedAt: daysFromNow(-3), // trả trễ 1 ngày
			eventDate: daysFromNow(-6),
			eventType: "Dự tiệc",
			totalAmount: 350000,
			depositPaid: 1200000,
			balanceDue: 0,
			lateFee: 50000,
			status: OrderStatus.RETURNED,
			paymentStatus: PaymentStatus.PAID,
			note: "Trả trễ 1 ngày, đã thu thêm phí",
			items: {
				create: [
					{
						itemId: itemVT_HQ_GR_M_01.id,
						rentalPrice: 350000,
						deposit: 1200000,
					},
				],
			},
		},
	});

	// Đơn 4: Chị Hoa - áo dài + váy đuôi cá, chưa đặt cọc, sự kiện xa
	const _ord4 = await prisma.order.create({
		data: {
			code: "ORD-004",
			customerId: cusHoa.id,
			rentalDate: daysFromNow(10),
			returnDate: daysFromNow(12),
			eventDate: daysFromNow(11),
			eventType: "Lễ cưới",
			totalAmount: 980000,
			depositPaid: 0,
			balanceDue: 980000,
			status: OrderStatus.PENDING,
			paymentStatus: PaymentStatus.UNPAID,
			items: {
				create: [
					{ itemId: itemAD_HS_B_S_01.id, rentalPrice: 280000, deposit: 900000 },
					{
						itemId: itemVC_DC_WH_S_01.id,
						rentalPrice: 700000,
						deposit: 4000000,
					},
				],
			},
		},
	});

	// Đơn 5: Anh Khánh - cận ngày trả, để hiển thị danh sách sắp đến hạn
	const ord5 = await prisma.order.create({
		data: {
			code: "ORD-005",
			customerId: cusKhanh.id,
			rentalDate: daysFromNow(-1),
			returnDate: daysFromNow(1),
			eventDate: daysFromNow(0),
			eventType: "Lễ ăn hỏi",
			totalAmount: 550000,
			depositPaid: 1200000,
			balanceDue: 550000,
			status: OrderStatus.PICKED_UP,
			paymentStatus: PaymentStatus.DEPOSITED,
			items: {
				create: [
					{
						itemId: itemVT_Y_NV_M_01.id,
						rentalPrice: 400000,
						deposit: 1500000,
					},
					{ itemId: itemVM_GO_02.id, rentalPrice: 150000, deposit: 500000 },
				],
			},
		},
	});

	// Đơn 6: Chị Vy - quá hạn trả, còn nợ
	const ord6 = await prisma.order.create({
		data: {
			code: "ORD-006",
			customerId: cusVy.id,
			rentalDate: daysFromNow(-5),
			returnDate: daysFromNow(-2),
			eventDate: daysFromNow(-4),
			eventType: "Tiệc công ty",
			totalAmount: 750000,
			depositPaid: 900000,
			balanceDue: 750000,
			lateFee: 100000,
			status: OrderStatus.PICKED_UP,
			paymentStatus: PaymentStatus.DEPOSITED,
			note: "Khách hẹn trả trễ thêm 2 ngày",
			items: {
				create: [
					{
						itemId: itemAD_PM_G_M_01.id,
						rentalPrice: 320000,
						deposit: 1000000,
					},
					{
						itemId: itemVC_DC_PK_S_01.id,
						rentalPrice: 700000,
						deposit: 4000000,
					},
				],
			},
		},
	});

	// Đơn 7: Anh Phong - đã trả, thanh toán đủ
	const ord7 = await prisma.order.create({
		data: {
			code: "ORD-007",
			customerId: cusPhong.id,
			rentalDate: daysFromNow(-12),
			returnDate: daysFromNow(-9),
			returnedAt: daysFromNow(-9),
			eventDate: daysFromNow(-11),
			eventType: "Chụp profile",
			totalAmount: 430000,
			depositPaid: 1500000,
			balanceDue: 0,
			status: OrderStatus.RETURNED,
			paymentStatus: PaymentStatus.PAID,
			items: {
				create: [
					{
						itemId: itemVT_Y_BL_L_02.id,
						rentalPrice: 400000,
						deposit: 1500000,
					},
				],
			},
		},
	});

	// Đơn 8: Chị Trâm - đã hủy
	const _ord8 = await prisma.order.create({
		data: {
			code: "ORD-008",
			customerId: cusTram.id,
			rentalDate: daysFromNow(14),
			returnDate: daysFromNow(16),
			eventDate: daysFromNow(15),
			eventType: "Lễ kỷ niệm",
			totalAmount: 1080000,
			depositPaid: 0,
			balanceDue: 1080000,
			status: OrderStatus.CANCELLED,
			paymentStatus: PaymentStatus.UNPAID,
			note: "Khách đổi lịch sự kiện",
			items: {
				create: [
					{
						itemId: itemVC_XO_WH_M_01.id,
						rentalPrice: 800000,
						deposit: 5000000,
					},
					{ itemId: itemVM_SI_01.id, rentalPrice: 150000, deposit: 500000 },
				],
			},
		},
	});

	// Đơn 9: Chị Lan - đơn cũ tháng trước
	const ord9 = await prisma.order.create({
		data: {
			code: "ORD-009",
			customerId: cusLan.id,
			rentalDate: daysFromNow(-32),
			returnDate: daysFromNow(-29),
			returnedAt: daysFromNow(-28),
			eventDate: daysFromNow(-31),
			eventType: "Lễ gia tiên",
			totalAmount: 580000,
			depositPaid: 1500000,
			balanceDue: 0,
			status: OrderStatus.RETURNED,
			paymentStatus: PaymentStatus.PAID,
			items: {
				create: [
					{
						itemId: itemAD_PM_R_L_01.id,
						rentalPrice: 300000,
						deposit: 1000000,
					},
					{ itemId: itemVM_GO_01.id, rentalPrice: 150000, deposit: 500000 },
				],
			},
		},
	});

	// Đơn 10: Chị Mai - đã lấy đồ, còn nợ
	const ord10 = await prisma.order.create({
		data: {
			code: "ORD-010",
			customerId: cusMai.id,
			rentalDate: daysFromNow(-3),
			returnDate: daysFromNow(2),
			eventDate: daysFromNow(-2),
			eventType: "Sự kiện ra mắt",
			totalAmount: 980000,
			depositPaid: 900000,
			balanceDue: 980000,
			status: OrderStatus.PICKED_UP,
			paymentStatus: PaymentStatus.DEPOSITED,
			items: {
				create: [
					{ itemId: itemAD_HS_B_S_01.id, rentalPrice: 280000, deposit: 900000 },
					{
						itemId: itemVC_DC_WH_S_01.id,
						rentalPrice: 700000,
						deposit: 4000000,
					},
				],
			},
		},
	});

	// Đơn 11: Anh Tuấn - chờ xác nhận, chưa cọc
	const _ord11 = await prisma.order.create({
		data: {
			code: "ORD-011",
			customerId: cusTuan.id,
			rentalDate: daysFromNow(8),
			returnDate: daysFromNow(9),
			eventDate: daysFromNow(8),
			eventType: "Lễ tốt nghiệp",
			totalAmount: 350000,
			depositPaid: 0,
			balanceDue: 350000,
			status: OrderStatus.PENDING,
			paymentStatus: PaymentStatus.UNPAID,
			items: {
				create: [
					{
						itemId: itemVT_HQ_GR_L_01.id,
						rentalPrice: 350000,
						deposit: 1200000,
					},
				],
			},
		},
	});

	// Đơn 12: Anh Phong - đã xác nhận, có phí phụ thu
	const ord12 = await prisma.order.create({
		data: {
			code: "ORD-012",
			customerId: cusPhong.id,
			rentalDate: daysFromNow(2),
			returnDate: daysFromNow(4),
			eventDate: daysFromNow(3),
			eventType: "Tiệc đính hôn",
			totalAmount: 830000,
			depositPaid: 1200000,
			balanceDue: 930000,
			damageFee: 100000,
			status: OrderStatus.CONFIRMED,
			paymentStatus: PaymentStatus.DEPOSITED,
			items: {
				create: [
					{
						itemId: itemVC_XO_WH_S_01.id,
						rentalPrice: 800000,
						deposit: 5000000,
					},
					{ itemId: itemVM_SI_01.id, rentalPrice: 150000, deposit: 500000 },
				],
			},
		},
	});

	// ==================== PAYMENTS ====================

	// Cọc đơn 1 - Chị Lan
	await prisma.payment.create({
		data: {
			orderId: ord1.id,
			amount: 2500000,
			method: "Chuyển khoản",
			note: "Đặt cọc ban đầu",
			paidAt: daysFromNow(-1),
		},
	});

	// Cọc đơn 2 - Chị Mai
	await prisma.payment.create({
		data: {
			orderId: ord2.id,
			amount: 5500000,
			method: "Tiền mặt",
			note: "Đặt cọc khi đến thử đồ",
			paidAt: daysFromNow(-2),
		},
	});

	// Thanh toán đơn 3 - Anh Tuấn (2 lần: cọc + thanh toán nốt)
	await prisma.payment.create({
		data: {
			orderId: ord3.id,
			amount: 1200000,
			method: "Chuyển khoản",
			note: "Đặt cọc",
			paidAt: daysFromNow(-8),
		},
	});

	// Cọc đơn 5
	await prisma.payment.create({
		data: {
			orderId: ord5.id,
			amount: 1200000,
			method: "Chuyển khoản",
			note: "Đặt cọc giữ đồ",
			paidAt: daysFromNow(-2),
		},
	});

	// Cọc đơn 6
	await prisma.payment.create({
		data: {
			orderId: ord6.id,
			amount: 900000,
			method: "Tiền mặt",
			note: "Đặt cọc tại cửa hàng",
			paidAt: daysFromNow(-6),
		},
	});

	// Thanh toán đủ đơn 7
	await prisma.payment.create({
		data: {
			orderId: ord7.id,
			amount: 1500000,
			method: "Chuyển khoản",
			note: "Đặt cọc",
			paidAt: daysFromNow(-13),
		},
	});
	await prisma.payment.create({
		data: {
			orderId: ord7.id,
			amount: 430000,
			method: "Tiền mặt",
			note: "Thanh toán khi trả đồ",
			paidAt: daysFromNow(-9),
		},
	});

	// Thanh toán đủ đơn 9
	await prisma.payment.create({
		data: {
			orderId: ord9.id,
			amount: 1500000,
			method: "Chuyển khoản",
			note: "Đặt cọc",
			paidAt: daysFromNow(-33),
		},
	});
	await prisma.payment.create({
		data: {
			orderId: ord9.id,
			amount: 580000,
			method: "Tiền mặt",
			note: "Tất toán khi trả đồ",
			paidAt: daysFromNow(-28),
		},
	});

	// Cọc đơn 10
	await prisma.payment.create({
		data: {
			orderId: ord10.id,
			amount: 900000,
			method: "Chuyển khoản",
			note: "Đặt cọc trước sự kiện",
			paidAt: daysFromNow(-4),
		},
	});

	// Cọc đơn 12
	await prisma.payment.create({
		data: {
			orderId: ord12.id,
			amount: 1200000,
			method: "Tiền mặt",
			note: "Đặt cọc ban đầu",
			paidAt: daysFromNow(0),
		},
	});
	await prisma.payment.create({
		data: {
			orderId: ord3.id,
			amount: 400000, // 350k tiền thuê + 50k phí trễ
			method: "Tiền mặt",
			note: "Thanh toán khi trả đồ, bao gồm 50k phí trả trễ",
			paidAt: daysFromNow(-3),
		},
	});

	// Reconcile tài chính đơn hàng theo logic server:
	// totalAmount = sum(rentalPrice) * số ngày thuê
	// depositPaid = tổng payment đã thu
	// balanceDue = max(totalAmount + lateFee + damageFee - depositPaid, 0)
	// paymentStatus được suy ra từ số đã thu và công nợ còn lại
	const ordersForReconcile = await prisma.order.findMany({
		include: {
			items: true,
			payments: true,
		},
	});

	for (const order of ordersForReconcile) {
		const rentalDays = calculateRentalDays(order.rentalDate, order.returnDate);
		const rentalPerDay = order.items.reduce(
			(sum, orderItem) => sum + orderItem.rentalPrice,
			0,
		);
		const totalAmount = rentalPerDay * rentalDays;
		const totalPaid = order.payments.reduce(
			(sum, payment) => sum + payment.amount,
			0,
		);
		const totalCharge =
			totalAmount + (order.lateFee ?? 0) + (order.damageFee ?? 0);
		const balanceDue = Math.max(totalCharge - totalPaid, 0);
		const paymentStatus = resolvePaymentStatus(totalPaid, balanceDue);

		await prisma.order.update({
			where: { id: order.id },
			data: {
				totalAmount,
				depositPaid: totalPaid,
				balanceDue,
				paymentStatus,
			},
		});
	}

	// ==================== MAINTENANCES ====================

	// Vest Ý đen L - đang thay cúc
	await prisma.maintenance.create({
		data: {
			itemId: itemVT_Y_BL_L_02.id,
			type: "Sửa chữa",
			description: "Thay toàn bộ hàng cúc áo vest",
			cost: 80000,
			startDate: daysFromNow(-2),
			done: false,
		},
	});

	// Áo dài hoa sen M - giặt hấp
	await prisma.maintenance.create({
		data: {
			itemId: itemAD_HS_B_M_01.id,
			type: "Vệ sinh",
			description: "Giặt hấp sau khi khách trả",
			cost: 50000,
			startDate: daysFromNow(-1),
			endDate: daysFromNow(1),
			done: false,
		},
	});

	// Vest HQ L - đã vệ sinh xong (lịch sử)
	await prisma.maintenance.create({
		data: {
			itemId: itemVT_HQ_GR_L_01.id,
			type: "Vệ sinh",
			description: "Giặt hấp định kỳ",
			cost: 60000,
			startDate: daysFromNow(-10),
			endDate: daysFromNow(-8),
			done: true,
		},
	});

	console.log("✅ Seed dữ liệu thành công!");
	console.log("   - 4 danh mục");
	console.log("   - 7 sản phẩm");
	console.log("   - 43 items");
	console.log("   - 8 khách hàng");
	console.log("   - 12 đơn hàng");
	console.log("   - 13 thanh toán");
	console.log("   - 3 bảo trì/vệ sinh");
}

main()
	.catch((e) => {
		console.error("❌ Lỗi seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
