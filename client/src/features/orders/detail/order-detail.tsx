import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import {
	IconArrowLeft,
	IconClock,
	IconCreditCard,
	IconEdit,
	IconMapPin,
	IconMessage2,
	IconPackage,
	IconPhone,
	IconPrinter,
	IconUser,
} from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { OrderFragment } from "@/gql/graphql";
import { formatVnd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { orderUpdatedSubscription } from "../../notifications/graphql";
import { orderQuery } from "../graphql";
import { updateOrderItem } from "../graphql/mutations";
import { OrderEditDialog } from "../orders/order-edit-dialog";
import {
	getOrderStatusConfig,
	getPaymentStatusConfig,
} from "../orders/orders-columns";
import { OrderPaymentPanel } from "./order-payment-panel";
import { PrintContract } from "./print-contract";

export function OrderDetail() {
	const { id } = useParams({ from: "/_app/orders/$id" });
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
	const [tempNote, setTempNote] = useState("");

	const { data, loading, error, refetch } = useQuery(orderQuery, {
		variables: { id },
	});

	useSubscription(orderUpdatedSubscription, {
		variables: { id },
		onData: ({ data: subData }) => {
			console.log("[OrderDetail] 🔔 Subscription onData fired:", subData);
			if (subData.data?.orderUpdated === id) {
				console.log("[OrderDetail] ✅ ID matches, refetching...");
				void refetch();
			}
		},
		onError: (err) => {
			console.error("[OrderDetail] ❌ Subscription error:", err);
		},
	});

	const [mutateItem, { loading: isSavingNote }] = useMutation(updateOrderItem, {
		onCompleted: () => {
			toast.success("Đã cập nhật ghi chú");
			setOpenPopoverId(null);
		},
		onError: (err) => toast.error(err.message),
	});

	if (error)
		return (
			<>
				<Header />
				<Main>
					<div className="flex items-center justify-center h-64 text-destructive">
						Lỗi: {error.message}
					</div>
				</Main>
			</>
		);
	if (!loading && !data?.order)
		return (
			<>
				<Header />
				<Main>
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						Không tìm thấy đơn hàng
					</div>
				</Main>
			</>
		);

	const order = data?.order;
	const statusConfig = order ? getOrderStatusConfig(order.status) : null;
	const paymentConfig = order
		? getPaymentStatusConfig(order.paymentStatus)
		: null;

	const handleSaveNote = async (itemId: string) => {
		await mutateItem({ variables: { id: itemId, damageNote: tempNote } });
	};

	return (
		<>
			<div className="print:hidden">
				<Header />

				<Main>
					<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
						<div className="flex items-start gap-3">
							<Button
								variant="outline"
								size="icon"
								className="rounded-full h-9 w-9 mt-0.5"
								nativeButton={false}
								render={<Link to="/orders" />}
							>
								<IconArrowLeft className="h-4 w-4" />
							</Button>
							<div>
								<div className="flex flex-wrap items-center gap-2 mb-1">
									<h1 className="text-2xl font-bold tracking-tight">
										{loading ? (
											<Skeleton className="h-8 w-48" />
										) : (
											<>
												Đơn hàng{" "}
												<span className="text-primary">{order?.code}</span>
											</>
										)}
									</h1>
									{loading ? (
										<Skeleton className="h-6 w-32 rounded-full" />
									) : (
										<span
											className={cn(
												"inline-flex items-center gap-1.5 rounded-full px-3 py-0.5",
												"text-xs font-semibold border",
												"bg-chart-2/10 text-chart-2 border-chart-2/30",
											)}
										>
											Đã cọc: {formatVnd(order?.depositPaid || 0)}
										</span>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{loading ? (
										<Skeleton className="h-4 w-64" />
									) : (
										<>
											Chi tiết thuê đồ của khách{" "}
											<span className="font-semibold text-foreground">
												{order?.customer.name}
											</span>
										</>
									)}
								</p>
							</div>
						</div>

						{loading ? (
							<Skeleton className="h-9 w-36" />
						) : (
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									className="gap-2"
									onClick={() => window.print()}
								>
									<IconPrinter className="h-4 w-4" />
									In hợp đồng
								</Button>
								<Button
									className="gap-2"
									onClick={() => setIsEditDialogOpen(true)}
								>
									<IconEdit className="h-4 w-4" />
									Chỉnh sửa chung
								</Button>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
						<div className="lg:col-span-2 space-y-5">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between flex-wrap gap-2">
										<CardTitle className="flex items-center gap-2">
											<IconClock className="h-4 w-4 text-primary" />
											Thông tin chung
										</CardTitle>
										<div className="flex gap-2 flex-wrap">
											{loading ? (
												<>
													<Skeleton className="h-6 w-20 rounded-full" />
													<Skeleton className="h-6 w-24 rounded-full" />
												</>
											) : (
												<>
													<Badge
														variant="outline"
														className={cn(
															"text-xs px-2.5 py-0.5",
															statusConfig?.className,
														)}
													>
														{statusConfig?.label}
													</Badge>
													<Badge
														variant="outline"
														className={cn(
															"text-xs px-2.5 py-0.5",
															paymentConfig?.className,
														)}
													>
														{paymentConfig?.label}
													</Badge>
												</>
											)}
										</div>
									</div>
								</CardHeader>

								<CardContent className="px-5 py-5">
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
										{[
											{ label: "Ngày thuê", key: "rentalDate" },
											{
												label: "Hạn trả",
												key: "returnDate",
												color: "text-chart-5",
											},
											{ label: "Trả thực tế", key: "returnedAt" },
											{ label: "Ngày sự kiện", key: "eventDate" },
										].map((item) => (
											<div key={item.label} className="space-y-1">
												<p className="text-xs text-muted-foreground uppercase tracking-wide">
													{item.label}
												</p>
												{loading ? (
													<Skeleton className="h-5 w-24" />
												) : (
													<p
														className={cn(
															"text-sm font-semibold",
															item.color || "text-foreground",
															item.key === "returnedAt" &&
																!order?.returnedAt &&
																"text-muted-foreground",
														)}
													>
														{item.key === "returnedAt"
															? order?.returnedAt
																? format(
																		new Date(order.returnedAt),
																		"dd MMM yyyy HH:mm",
																		{ locale: vi },
																	)
																: "Chưa trả"
															: item.key === "eventDate"
																? order?.eventDate
																	? format(
																			new Date(order.eventDate),
																			"dd MMM yyyy",
																			{
																				locale: vi,
																			},
																		)
																	: "Không có"
																: order &&
																		(order as OrderFragment)[
																			item.key as keyof OrderFragment
																		]
																	? format(
																			new Date(
																				(order as OrderFragment)[
																					item.key as keyof OrderFragment
																				] as string,
																			),
																			"dd MMM yyyy",
																			{
																				locale: vi,
																			},
																		)
																	: "N/A"}
													</p>
												)}
											</div>
										))}
									</div>

									{loading ? (
										<Skeleton className="mt-5 h-12 w-full rounded-lg" />
									) : (
										<div
											className={cn(
												"mt-5 flex items-center justify-between rounded-lg px-4 py-3",
												"bg-chart-2/10 border border-chart-2/30",
											)}
										>
											<div className="flex items-center gap-2 text-chart-2">
												<IconCreditCard className="h-4 w-4" />
												<span className="text-sm font-medium">
													Khách đã cọc
												</span>
											</div>
											<span className="text-lg font-black text-chart-2">
												{formatVnd(order?.depositPaid || 0)}
											</span>
										</div>
									)}

									{loading ? (
										<Skeleton className="mt-4 h-10 w-full rounded-lg" />
									) : (
										order?.note && (
											<div
												className={cn(
													"mt-4 flex gap-2 rounded-lg px-4 py-3 text-sm",
													"bg-chart-4/10 border border-chart-4/30 text-chart-4",
												)}
											>
												<span className="font-semibold shrink-0">Ghi chú:</span>
												<span className="italic">{order.note}</span>
											</div>
										)
									)}
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<IconPackage className="h-4 w-4 text-primary" />
										Danh sách sản phẩm
									</CardTitle>
								</CardHeader>

								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow className="bg-muted/50 hover:bg-muted/50">
												<TableHead className="pl-5 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
													Sản phẩm
												</TableHead>
												<TableHead className="text-right text-xs text-muted-foreground uppercase tracking-wide font-semibold">
													Giá thuê
												</TableHead>
												<TableHead className="text-right text-xs text-muted-foreground uppercase tracking-wide font-semibold">
													Tiền cọc
												</TableHead>
												<TableHead className="pr-5 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
													Ghi chú hư hại
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{loading
												? Array.from({ length: 3 }).map((_, i) => (
														<TableRow key={`skeleton-item-${i}`}>
															<TableCell className="pl-5 py-3">
																<div className="flex items-center gap-3">
																	<Skeleton className="w-10 h-10 rounded-lg" />
																	<div className="space-y-1">
																		<Skeleton className="h-4 w-32" />
																		<Skeleton className="h-3 w-48" />
																	</div>
																</div>
															</TableCell>
															<TableCell>
																<Skeleton className="ml-auto h-4 w-20" />
															</TableCell>
															<TableCell>
																<Skeleton className="ml-auto h-4 w-20" />
															</TableCell>
															<TableCell className="pr-5">
																<Skeleton className="h-4 w-24" />
															</TableCell>
														</TableRow>
													))
												: order?.items.map((item, idx) => (
														<TableRow
															key={item.id}
															className={cn(
																"border-b border-border transition-colors hover:bg-accent/40",
																idx % 2 !== 0 && "bg-muted/30",
															)}
														>
															<TableCell className="pl-5 py-3">
																<div className="flex items-center gap-3">
																	{item.item.variant.imageUrl ? (
																		<img
																			src={item.item.variant.imageUrl}
																			alt={item.item.variant.product.name}
																			className="w-10 h-10 rounded-lg object-cover border border-border shadow-sm"
																		/>
																	) : (
																		<div className="w-10 h-10 rounded-lg bg-accent border border-border flex items-center justify-center">
																			<IconPackage className="h-4 w-4 text-muted-foreground" />
																		</div>
																	)}
																	<div>
																		<p className="font-semibold text-sm text-foreground">
																			{item.item.variant.product.name}
																		</p>
																		<p className="text-xs text-muted-foreground font-mono mt-0.5">
																			{item.item.code} ·{" "}
																			{item.item.variant.color},{" "}
																			{item.item.variant.size}
																		</p>
																	</div>
																</div>
															</TableCell>
															<TableCell className="text-right font-semibold text-sm text-foreground">
																{formatVnd(item.rentalPrice)}
															</TableCell>
															<TableCell className="text-right font-semibold text-sm text-foreground">
																{formatVnd(item.deposit)}
															</TableCell>
															<TableCell className="pr-5">
																<Popover
																	open={openPopoverId === item.id}
																	onOpenChange={(open) => {
																		if (open) {
																			setOpenPopoverId(item.id);
																			setTempNote(item.damageNote || "");
																		} else {
																			setOpenPopoverId(null);
																		}
																	}}
																>
																	<PopoverTrigger
																		className={cn(
																			"group flex items-center gap-1.5 w-full text-left",
																			"cursor-pointer rounded-md px-2 py-1.5 transition-colors",
																			"hover:bg-accent",
																		)}
																	>
																		<IconMessage2 className="size-3.5 text-muted-foreground shrink-0" />
																		<span
																			className={cn(
																				"text-xs truncate max-w-[140px]",
																				item.damageNote
																					? "text-foreground font-medium"
																					: "text-muted-foreground italic",
																			)}
																		>
																			{item.damageNote || "Thêm ghi chú..."}
																		</span>
																	</PopoverTrigger>
																	<PopoverContent className="w-80">
																		<PopoverHeader>
																			<PopoverTitle className="text-sm font-semibold">
																				Ghi chú tình trạng
																			</PopoverTitle>
																		</PopoverHeader>
																		<div className="mt-3 space-y-3">
																			<InputGroup>
																				<InputGroupTextarea
																					placeholder="Nhập tình trạng sản phẩm (rách, bẩn, mất phụ kiện...)"
																					value={tempNote}
																					onChange={(e) =>
																						setTempNote(e.target.value)
																					}
																					rows={3}
																					autoFocus
																					className="text-sm"
																				/>
																			</InputGroup>
																			<div className="flex justify-end gap-2">
																				<Button
																					size="sm"
																					variant="outline"
																					onClick={() => setOpenPopoverId(null)}
																					className="text-xs h-8"
																				>
																					Hủy
																				</Button>
																				<Button
																					size="sm"
																					onClick={() =>
																						handleSaveNote(item.id)
																					}
																					disabled={isSavingNote}
																					className="text-xs h-8"
																				>
																					Lưu ghi chú
																				</Button>
																			</div>
																		</div>
																	</PopoverContent>
																</Popover>
															</TableCell>
														</TableRow>
													))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-5">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<IconUser className="h-4 w-4 text-primary" />
										Khách hàng
									</CardTitle>
								</CardHeader>
								<CardContent className="px-5 py-4 space-y-4">
									{loading
										? Array.from({ length: 3 }).map((_, i) => (
												<div
													key={`skeleton-customer-${i}`}
													className="flex items-start gap-3"
												>
													<Skeleton className="h-7 w-7 rounded-full" />
													<div className="space-y-1">
														<Skeleton className="h-3 w-16" />
														<Skeleton className="h-4 w-32" />
													</div>
												</div>
											))
										: [
												{
													icon: IconUser,
													label: "Họ tên",
													value: order?.customer.name,
												},
												{
													icon: IconPhone,
													label: "Điện thoại",
													value: order?.customer.phone,
												},
												{
													icon: IconMapPin,
													label: "Địa chỉ",
													value: order?.customer.address || "Chưa cập nhật",
												},
											].map(({ icon: Icon, label, value }) => (
												<div key={label} className="flex items-start gap-3">
													<div className="mt-0.5 h-7 w-7 rounded-full bg-accent flex items-center justify-center shrink-0">
														<Icon className="h-3.5 w-3.5 text-primary" />
													</div>
													<div>
														<p className="text-xs text-muted-foreground mb-0.5">
															{label}
														</p>
														<p className="text-sm font-semibold text-foreground">
															{value}
														</p>
													</div>
												</div>
											))}
								</CardContent>
							</Card>
							{loading ? (
								<Skeleton className="h-64 w-full rounded-2xl" />
							) : (
								<OrderPaymentPanel order={order} />
							)}
						</div>
					</div>
				</Main>
			</div>

			{!loading && order && (
				<>
					<OrderEditDialog
						open={isEditDialogOpen}
						onOpenChange={setIsEditDialogOpen}
						currentRow={order}
					/>
					<PrintContract order={order} />
				</>
			)}
		</>
	);
}
