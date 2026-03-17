import { differenceInCalendarDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import type { OrderFragment } from "@/gql/graphql";
import { formatVnd } from "@/lib/format";

export function PrintContract({ order }: { order: OrderFragment }) {
	const totalRentalPrice = order.totalAmount;
	const depositPaid = order.depositPaid || 0;
	const remainingAmount = Math.max(0, order.balanceDue);

	const rentalDays =
		order.rentalDate && order.returnDate
			? Math.max(
					1,
					differenceInCalendarDays(
						new Date(order.returnDate),
						new Date(order.rentalDate),
					),
				)
			: 1;

	return (
		<div
			className="w-full text-black bg-white font-sans"
			style={{
				fontSize: "9px",
				lineHeight: "1.4",
				color: "#1a1a1a",
				fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif",
			}}
		>
			{/* ===== HEADER ===== */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "10px",
					paddingBottom: "8px",
					borderBottom: "2px solid #e2c87a",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<img
						src="/logo.png"
						alt="Harmony Wedding Logo"
						style={{ width: "44px", height: "44px", objectFit: "contain" }}
					/>
					<div>
						<div
							style={{
								fontSize: "13px",
								fontWeight: 900,
								color: "#7c3f1e",
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								lineHeight: 1.1,
							}}
						>
							Harmony Wedding
						</div>
						<div
							style={{
								fontSize: "7.5px",
								color: "#a07850",
								fontStyle: "italic",
								marginTop: "2px",
							}}
						>
							Lưu giữ khoảnh khắc trọn vẹn
						</div>
					</div>
				</div>

				<div style={{ textAlign: "right" }}>
					<div
						style={{
							fontSize: "13px",
							fontWeight: 800,
							textTransform: "uppercase",
							color: "#2d2d2d",
							letterSpacing: "0.04em",
							lineHeight: 1.2,
						}}
					>
						Hợp Đồng Thuê
					</div>
					<div
						style={{
							display: "inline-block",
							marginTop: "3px",
							background: "#fdf6e3",
							border: "1px solid #e2c87a",
							borderRadius: "4px",
							padding: "1px 7px",
							fontSize: "7.5px",
							fontFamily: "monospace",
							color: "#7c3f1e",
							fontWeight: 600,
						}}
					>
						Số đơn: {order.code}
					</div>
				</div>
			</div>

			{/* ===== STUDIO & CUSTOMER INFO ===== */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "8px",
					marginBottom: "10px",
					pageBreakInside: "avoid",
					breakInside: "avoid",
					alignItems: "start",
				}}
			>
				{/* Studio Info */}
				<div
					style={{
						padding: "8px 10px",
						borderRadius: "6px",
						background: "#fdf6e3",
						pageBreakInside: "avoid",
						breakInside: "avoid",
					}}
				>
					<div
						style={{
							fontWeight: 700,
							fontSize: "7.5px",
							textTransform: "uppercase",
							color: "#7c3f1e",
							letterSpacing: "0.06em",
							marginBottom: "5px",
							display: "flex",
							alignItems: "center",
							gap: "5px",
						}}
					>
						<span
							style={{
								display: "inline-block",
								width: "5px",
								height: "5px",
								borderRadius: "50%",
								background: "#e2c87a",
							}}
						/>
						Thông tin Studio
					</div>
					<InfoRow label="Quản lý" value="Hiếu Trần Canon" bold />
					<InfoRow label="Hotline" value="0388660678" bold />
					<InfoRow
						label="Địa chỉ"
						value="45, Đường cuối chợ, Đông hóa, Trảng Bom, Đồng Nai"
					/>
					<InfoRow
						label="STK"
						value="0388660678 Trần Quốc Hiếu — MB Bank"
						bold
						accent
					/>
					<InfoRow label="Mail" value="Studiohieutrancanon@gmail.com" accent />
				</div>

				{/* Customer Info */}
				<div
					style={{
						padding: "8px 10px",
						borderRadius: "6px",
						background: "#f9f4ff",
						pageBreakInside: "avoid",
						breakInside: "avoid",
					}}
				>
					<div
						style={{
							fontWeight: 700,
							fontSize: "7.5px",
							textTransform: "uppercase",
							color: "#6b3fa0",
							letterSpacing: "0.06em",
							marginBottom: "5px",
							display: "flex",
							alignItems: "center",
							gap: "5px",
						}}
					>
						<span
							style={{
								display: "inline-block",
								width: "5px",
								height: "5px",
								borderRadius: "50%",
								background: "#c4a8e0",
							}}
						/>
						Thông tin Khách
					</div>
					<InfoRow
						label="Khách hàng"
						value={order.customer.name}
						bold
						bigName
					/>
					<InfoRow label="Điện thoại" value={order.customer.phone} bold />
					<InfoRow label="Địa chỉ" value={order.customer.address || "..."} />
					<InfoRow
						label="Ngày sự kiện"
						value={
							order.eventDate
								? format(new Date(order.eventDate), "dd MMM yyyy")
								: "..."
						}
						bold
						accent
					/>
					<InfoRow
						label="Ngày lấy đồ"
						value={
							order.rentalDate
								? format(new Date(order.rentalDate), "dd MMM yyyy", {
										locale: vi,
									})
								: "..."
						}
						bold
						accent
					/>
					<InfoRow
						label="Ngày trả đồ"
						value={
							order.returnDate
								? format(new Date(order.returnDate), "dd MMM yyyy", {
										locale: vi,
									})
								: "..."
						}
						bold
						accent
					/>
				</div>
			</div>

			{/* ===== ITEMS LIST ===== */}
			{/*
			  FIX: border bị mất đoạn khi in do border-collapse + page break.
			  Dùng border trên từng <td> thay vì dùng divide-y, và thêm
			  -webkit-print-color-adjust: exact + print-color-adjust: exact
			  trên bảng để background/border không bị trình duyệt bỏ khi in.
			*/}
			<div
				style={{
					marginBottom: "10px",
					pageBreakInside: "avoid",
					breakInside: "avoid",
					border: "1.5px solid #bba17a", // Darker border
					borderRadius: "6px",
					overflow: "hidden",
				}}
			>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						tableLayout: "fixed",
						WebkitPrintColorAdjust: "exact",
						printColorAdjust: "exact",
					}}
				>
					<colgroup>
						<col style={{ width: "22px" }} />
						<col />
						<col style={{ width: "26px" }} />
						<col style={{ width: "64px" }} />
						<col style={{ width: "68px" }} />
					</colgroup>
					<thead>
						<tr
							style={{
								background: "#f5ede0",
								WebkitPrintColorAdjust: "exact",
								printColorAdjust: "exact",
							}}
						>
							{[
								{ label: "STT", align: "center" as const },
								{ label: "Tên sản phẩm", align: "left" as const },
								{ label: "SL", align: "center" as const },
								{ label: "Giá thuê", align: "right" as const },
								{ label: "Thành tiền", align: "right" as const },
							].map((col, i) => (
								<th
									key={i}
									style={{
										padding: "5px 6px",
										textAlign: col.align,
										fontSize: "7.5px",
										fontWeight: 700,
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										color: "#5c3d1e",
										borderBottom: "1.5px solid #bba17a",
										borderRight: i < 4 ? "1px solid #d1c4ae" : "none",
									}}
								>
									{col.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{order.items.map((item, idx) => {
							const isLastRow = idx === order.items.length - 1;
							const rowStyle: React.CSSProperties = {
								background: idx % 2 === 0 ? "#ffffff" : "#fdfaf5",
								WebkitPrintColorAdjust: "exact",
								printColorAdjust: "exact",
							};
							const cellStyle: React.CSSProperties = {
								padding: "5px 6px",
								borderBottom: isLastRow ? "none" : "1px solid #e5e0d5",
								borderRight: "1px solid #e5e0d5",
								verticalAlign: "top",
							};

							return (
								<tr key={item.id} style={rowStyle}>
									<td
										style={{
											...cellStyle,
											textAlign: "center",
											color: "#999",
											fontSize: "8px",
										}}
									>
										{idx + 1}
									</td>
									<td style={cellStyle}>
										<div
											style={{
												fontWeight: 700,
												fontSize: "8.5px",
												color: "#1a1a1a",
												lineHeight: 1.2,
											}}
										>
											{item.item.variant.product.name}
										</div>
										<div
											style={{
												fontSize: "7.5px",
												color: "#888",
												marginTop: "1px",
											}}
										>
											Mã: {item.item.code} · {item.item.variant.color},{" "}
											{item.item.variant.size}
										</div>
										{item.damageNote && (
											<div
												style={{
													fontSize: "7.5px",
													fontStyle: "italic",
													color: "#666",
													marginTop: "2px",
												}}
											>
												{item.damageNote}
											</div>
										)}
									</td>
									<td
										style={{
											...cellStyle,
											textAlign: "center",
											fontWeight: 500,
											fontSize: "8px",
										}}
									>
										1
									</td>
									<td
										style={{
											...cellStyle,
											textAlign: "right",
											fontWeight: 500,
											fontSize: "8px",
											color: "#444",
										}}
									>
										{formatVnd(item.rentalPrice)}
									</td>
									<td
										style={{
											...cellStyle,
											textAlign: "right",
											fontWeight: 700,
											fontSize: "8.5px",
											color: "#7c3f1e",
											borderRight: "none",
										}}
									>
										{formatVnd(item.rentalPrice * rentalDays)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* ===== NOTES & SUMMARY ===== */}
			<div
				style={{
					display: "flex",
					gap: "8px",
					alignItems: "start",
					pageBreakInside: "avoid",
					breakInside: "avoid",
					marginBottom: "10px",
				}}
			>
				{/* Notes */}
				<div
					style={{
						flex: 1,
						borderRadius: "5px",
						background: "#fffbeb",
						border: "1px solid #DC143C",
						padding: "8px 10px",
					}}
				>
					<div
						style={{
							fontWeight: 700,
							fontSize: "7.5px",
							textTransform: "uppercase",
							color: "#d97706",
							letterSpacing: "0.06em",
							marginBottom: "4px",
						}}
					>
						Quy định thuê đồ:
					</div>
					<div
						style={{
							fontSize: "8.5px",
							color: "#374151",
							lineHeight: 1.5,
						}}
					>
						Đồ thuê bị rách, dính rượu vang, cháy xém hay tạp chất không thể tẩy
						rửa, khách hàng sẽ đền bù giá trị món đồ theo quy định của studio.
						Vui lòng kiểm tra kỹ tình trạng trước khi nhận.
					</div>

					{order.note && (
						<div style={{ marginTop: "6px" }}>
							<div
								style={{
									fontWeight: 700,
									fontSize: "7.5px",
									textTransform: "uppercase",
									color: "#3b82f6",
									letterSpacing: "0.06em",
									marginBottom: "3px",
								}}
							>
								Ghi chú đơn hàng:
							</div>
							<div
								style={{
									fontSize: "8.5px",
									color: "#374151",
									fontStyle: "italic",
									lineHeight: 1.5,
								}}
							>
								{order.note}
							</div>
						</div>
					)}
				</div>

				{/* Summary */}
				<div
					style={{
						width: "44%",
						background: "#fdf6e3",
						border: "1.5px solid #e2c87a",
						borderRadius: "6px",
						padding: "10px 12px",
					}}
				>
					<SummaryRow
						label="Tổng đơn"
						value={formatVnd(totalRentalPrice)}
						big
					/>
					<div
						style={{
							borderBottom: "1px dashed #d6b96a",
							marginBottom: "6px",
							paddingBottom: "6px",
						}}
					>
						<SummaryRow
							label="Khách đã cọc"
							value={formatVnd(depositPaid)}
							green
						/>
					</div>
					<SummaryRow
						label="Còn lại"
						value={formatVnd(remainingAmount)}
						red
						big
					/>
				</div>
			</div>

			{/* ===== SIGNATURES ===== */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					borderTop: "1.5px solid #e2c87a",
					paddingTop: "10px",
					pageBreakInside: "avoid",
					breakInside: "avoid",
				}}
			>
				{["Khách hàng", "Đại diện Studio"].map((label) => (
					<div
						key={label}
						style={{ flex: 1, textAlign: "center", padding: "0 8px" }}
					>
						<div
							style={{
								fontWeight: 700,
								fontSize: "9px",
								textTransform: "uppercase",
								color: "#2d2d2d",
								letterSpacing: "0.05em",
							}}
						>
							{label}
						</div>
						<div
							style={{
								fontSize: "7.5px",
								color: "#aaa",
								fontStyle: "italic",
								marginTop: "1px",
							}}
						>
							(Ký, ghi rõ họ tên)
						</div>
						<div style={{ height: "52px" }} />
						<div
							style={{
								borderBottom: "1px dashed #bbb",
								width: "110px",
								margin: "0 auto",
							}}
						/>
					</div>
				))}
			</div>

			{/* ===== FOOTER ===== */}
			<div
				style={{
					marginTop: "8px",
					textAlign: "center",
					fontSize: "7.5px",
					color: "#bbb",
					fontStyle: "italic",
					borderTop: "1px solid #f0e8d8",
					paddingTop: "5px",
				}}
			>
				Cảm ơn quý khách đã tin tưởng và lựa chọn dịch vụ của{" "}
				<strong style={{ color: "#a07850" }}>Harmony Wedding</strong>!
			</div>
		</div>
	);
}

/* ── Small helper components ── */

function InfoRow({
	label,
	value,
	bold,
	bigName,
	accent,
}: {
	label: string;
	value: string;
	bold?: boolean;
	bigName?: boolean;
	accent?: boolean;
}) {
	return (
		<div style={{ marginBottom: "2px", lineHeight: 1.4 }}>
			<span style={{ color: "#999", fontWeight: 500 }}>{label}: </span>
			<span
				style={{
					fontWeight: bold || bigName ? 700 : 400,
					fontSize: bigName ? "10px" : "inherit",
					color: accent ? "#7c3f1e" : "#1a1a1a",
				}}
			>
				{value}
			</span>
		</div>
	);
}

function SummaryRow({
	label,
	value,
	big,
	green,
	red,
}: {
	label: string;
	value: string;
	big?: boolean;
	green?: boolean;
	red?: boolean;
}) {
	// Synchronize colors with the Studio palette
	const labelColor = red ? "#991b1b" : "#5c3d1e";
	const valueColor = red ? "#991b1b" : green ? "#166534" : "#1a1a1a";

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "baseline",
				marginBottom: "4px",
			}}
		>
			<span
				style={{
					fontWeight: big ? 700 : 500,
					textTransform: big ? "uppercase" : "none",
					fontSize: big ? "9px" : "8px",
					color: labelColor,
					letterSpacing: big ? "0.04em" : "normal",
				}}
			>
				{label}
			</span>
			<span
				style={{
					fontWeight: 700,
					fontSize: big ? (red ? "11px" : "10px") : "8.5px",
					color: valueColor,
					textAlign: "right",
					flexGrow: 1,
					paddingLeft: "8px",
				}}
			>
				{value}
			</span>
		</div>
	);
}
