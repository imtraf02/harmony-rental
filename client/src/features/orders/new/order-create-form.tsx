import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { differenceInDays, startOfDay } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { DatePickerField } from "@/components/date-picker-field";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomersSelect } from "@/features/customers";
import type { ItemFragment } from "@/gql/graphql";
import { createOrder, ordersQuery } from "../graphql";
import { ItemPicker } from "./item-picker";

const formSchema = z.object({
	customer: z.object({
		name: z.string().min(1, "Vui lòng nhập tên khách hàng"),
		phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
		address: z.string(),
		note: z.string(),
	}),
	rentalDate: z.string().min(1, "Vui lòng chọn ngày thuê"),
	returnDate: z.string().min(1, "Vui lòng chọn ngày trả"),
	eventDate: z.string(),
	eventType: z.string(),
	depositPaid: z.number().min(0, "Số tiền không hợp lệ"),
	note: z.string(),
});

function formatCurrency(value: number) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);
}

export function OrderCreateForm() {
	const navigate = useNavigate();
	const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<ItemFragment[]>([]);

	const [mutate, { loading }] = useMutation(createOrder, {
		onCompleted: (data) => {
			const finalTotal = data?.createOrder?.totalAmount ?? 0;
			toast.success(
				`Tạo đơn thuê thành công. Tổng tiền: ${formatCurrency(finalTotal)}`,
			);
			navigate({ to: "/orders" });
		},
		onError: (err) => {
			toast.error(err.message || "Đã có lỗi xảy ra");
		},
		refetchQueries: [{ query: ordersQuery }],
	});

	const itemsBaseRental = selectedItems.reduce(
		(acc, item) => acc + item.variant.rentalPrice,
		0,
	);
	const totalDeposit = selectedItems.reduce(
		(acc, item) => acc + item.variant.deposit,
		0,
	);

	const form = useForm({
		defaultValues: {
			customer: {
				name: "",
				phone: "",
				address: "",
				note: "",
			},
			rentalDate: new Date().toISOString().split("T")[0],
			returnDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
			eventDate: "",
			eventType: "",
			depositPaid: 0,
			note: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			if (selectedItems.length === 0) {
				toast.error("Vui lòng chọn ít nhất một sản phẩm");
				return;
			}

			await mutate({
				variables: {
					input: {
						customer: value.customer,
						rentalDate: new Date(value.rentalDate).toISOString(),
						returnDate: new Date(value.returnDate).toISOString(),
						eventDate: value.eventDate
							? new Date(value.eventDate).toISOString()
							: undefined,
						eventType: value.eventType || undefined,
						// The server is the source of truth and recalculates totalAmount.
						totalAmount: 0,
						depositPaid: Number(value.depositPaid),
						note: value.note || undefined,
						items: selectedItems.map((item) => ({
							itemId: item.id,
							rentalPrice: item.variant.rentalPrice,
							deposit: item.variant.deposit,
						})),
					},
				},
			});
		},
	});

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex gap-6 max-w-7xl mx-auto flex-col lg:flex-row"
			>
				<div className="flex-1 space-y-6">
					<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
						<div className="flex flex-col space-y-1.5 p-6">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div>
									<h3 className="font-semibold leading-none tracking-tight text-lg">
										Thông tin khách hàng
									</h3>
									<p className="text-sm text-muted-foreground mt-1">
										Nhập mới hoặc chọn khách hàng đã có trong hệ thống.
									</p>
								</div>
								<div className="w-full sm:w-64">
									<Suspense
										fallback={<Skeleton className="h-8 w-full rounded-lg" />}
									>
										<CustomersSelect
											onValueChange={(customer) => {
												if (customer) {
													form.setFieldValue("customer.name", customer.name);
													form.setFieldValue("customer.phone", customer.phone);
													form.setFieldValue(
														"customer.address",
														customer.address || "",
													);
													form.setFieldValue(
														"customer.note",
														customer.note || "",
													);
												}
											}}
										/>
									</Suspense>
								</div>
							</div>
						</div>
						<div className="p-6 pt-0">
							<FieldGroup>
								<div className="grid grid-cols-2 gap-4">
									<form.Field name="customer.name">
										{(field) => {
											const isInvalid = !!field.state.meta.errors.length;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Tên khách hàng
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder="Nhập họ tên"
														aria-invalid={isInvalid}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
									<form.Field name="customer.phone">
										{(field) => {
											const isInvalid = !!field.state.meta.errors.length;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>
														Số điện thoại
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder="Nhập số điện thoại"
														aria-invalid={isInvalid}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
								</div>
								<form.Field name="customer.address">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Địa chỉ{" "}
												<span className="font-normal text-muted-foreground">
													(tùy chọn)
												</span>
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Nhập địa chỉ"
											/>
										</Field>
									)}
								</form.Field>
								<form.Field name="customer.note">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Ghi chú khách hàng{" "}
												<span className="font-normal text-muted-foreground">
													(tùy chọn)
												</span>
											</FieldLabel>
											<InputGroup>
												<InputGroupTextarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Thông tin thêm về khách hàng..."
													rows={3}
													className="min-h-20"
												/>
												<InputGroupAddon align="block-end">
													<InputGroupText className="tabular-nums">
														{field.state.value.length} ký tự
													</InputGroupText>
												</InputGroupAddon>
											</InputGroup>
										</Field>
									)}
								</form.Field>
							</FieldGroup>
						</div>
					</div>

					<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
						<div className="flex flex-col space-y-1.5 p-6">
							<h3 className="font-semibold leading-none tracking-tight text-lg">
								Thông tin thuê
							</h3>
						</div>
						<div className="p-6 pt-0">
							<FieldGroup>
								<div className="grid grid-cols-2 gap-4">
									<form.Field name="rentalDate">
										{(field) => {
											const isInvalid = !!field.state.meta.errors.length;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>Ngày thuê</FieldLabel>
													<DatePickerField
														value={field.state.value}
														onChange={(val) => field.handleChange(val ?? "")}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
									<form.Field name="returnDate">
										{(field) => {
											const isInvalid = !!field.state.meta.errors.length;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>Ngày trả (dự kiến)</FieldLabel>
													<DatePickerField
														value={field.state.value}
														onChange={(val) => field.handleChange(val ?? "")}
													/>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									</form.Field>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<form.Field name="eventDate">
										{(field) => (
											<Field>
												<FieldLabel>
													Ngày sự kiện{" "}
													<span className="font-normal text-muted-foreground">
														(tùy chọn)
													</span>
												</FieldLabel>
												<DatePickerField
													value={field.state.value}
													onChange={(val) => field.handleChange(val ?? "")}
												/>
											</Field>
										)}
									</form.Field>
									<form.Field name="eventType">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>
													Loại sự kiện{" "}
													<span className="font-normal text-muted-foreground">
														(tùy chọn)
													</span>
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="VD: Cưới hỏi, Chụp ảnh..."
												/>
											</Field>
										)}
									</form.Field>
								</div>
								<form.Field name="note">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Ghi chú đơn hàng{" "}
												<span className="font-normal text-muted-foreground">
													(tùy chọn)
												</span>
											</FieldLabel>
											<InputGroup>
												<InputGroupTextarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Ghi chú thêm về đơn thuê này..."
													rows={3}
													className="min-h-20"
												/>
												<InputGroupAddon align="block-end">
													<InputGroupText className="tabular-nums">
														{field.state.value.length} ký tự
													</InputGroupText>
												</InputGroupAddon>
											</InputGroup>
										</Field>
									)}
								</form.Field>
							</FieldGroup>
						</div>
					</div>
				</div>

				<div className="w-full lg:w-114 space-y-6">
					<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
						<div className="flex flex-row items-center justify-between p-6 space-y-0">
							<div className="flex flex-col space-y-1.5">
								<h3 className="font-semibold leading-none tracking-tight text-lg">
									Sản phẩm thuê
								</h3>
								<p className="text-sm text-muted-foreground">
									Danh sách các món đồ khách hàng thuê.
								</p>
							</div>
							<Button
								type="button"
								size="sm"
								onClick={() => setIsItemPickerOpen(true)}
							>
								<Plus className="w-4 h-4 mr-1" />
								Thêm
							</Button>
						</div>
						<div className="p-6 pt-0">
							{selectedItems.length === 0 ? (
								<div className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
									<p className="text-sm text-muted-foreground">
										Chưa có sản phẩm nào được chọn.
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{selectedItems.map((item) => (
										<div
											key={item.id}
											className="flex gap-3 items-center border p-2 rounded-lg bg-card"
										>
											<div className="w-12 h-12 bg-muted rounded overflow-hidden shrink-0">
												{item.variant.imageUrl ? (
													<img
														src={
															item.variant.imageUrl.startsWith("http")
																? item.variant.imageUrl
																: `http://localhost:4000${item.variant.imageUrl}`
														}
														alt={item.variant.product.name}
														className="w-full h-full object-cover"
													/>
												) : null}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-sm truncate">
													{item.variant.product.name}
												</p>
												<div className="text-xs text-muted-foreground flex gap-2 mt-0.5">
													<span>
														Giá/ngày: {formatCurrency(item.variant.rentalPrice)}
													</span>
													<span>
														Cọc: {formatCurrency(item.variant.deposit)}
													</span>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="shrink-0 text-muted-foreground hover:text-destructive"
												onClick={() =>
													setSelectedItems((prev) =>
														prev.filter((i) => i.id !== item.id),
													)
												}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
						<div className="flex flex-col space-y-1.5 p-6">
							<h3 className="font-semibold leading-none tracking-tight text-lg">
								Thanh toán
							</h3>
						</div>
						<div className="p-6 pt-0 space-y-4">
							<form.Subscribe
								selector={(s) => [s.values.rentalDate, s.values.returnDate]}
							>
								{([rDate, retDate]) => {
									const days = Math.max(
										1,
										differenceInDays(
											startOfDay(new Date(retDate)),
											startOfDay(new Date(rDate)),
										),
									);
									const currentRentalPrice = itemsBaseRental * days;

									return (
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Tổng giá thuê ({days} ngày):
												</span>
												<span className="font-medium">
													{formatCurrency(currentRentalPrice)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Tổng tiền cọc yêu cầu:
												</span>
												<span className="font-medium">
													{formatCurrency(totalDeposit)}
												</span>
											</div>
											<div className="flex justify-between pt-2 border-t text-base font-semibold">
												<span>Tổng tiền thuê:</span>
												<span className="text-primary text-xl">
													{formatCurrency(currentRentalPrice)}
												</span>
											</div>
										</div>
									);
								}}
							</form.Subscribe>

							<form.Field name="depositPaid">
								{(field) => {
									const isInvalid = !!field.state.meta.errors.length;
									return (
										<Field data-invalid={isInvalid} className="pt-4 border-t">
											<div className="flex justify-between items-center mb-1">
												<FieldLabel htmlFor={field.name}>
													Tiền khách đã cọc/trả trước
												</FieldLabel>
												<Button
													type="button"
													variant="link"
													size="sm"
													className="h-auto p-0 text-xs"
													onClick={() => field.handleChange(totalDeposit)}
												>
													Điền đủ cọc
												</Button>
											</div>
											<Input
												id={field.name}
												name={field.name}
												type="number"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(Number(e.target.value))
												}
												placeholder="0"
												aria-invalid={isInvalid}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Subscribe
								selector={(s) => [
									s.values.rentalDate,
									s.values.returnDate,
									s.values.depositPaid,
								]}
							>
								{([rDate, retDate, dPaid]) => {
									const days = Math.max(
										1,
										differenceInDays(
											startOfDay(new Date(retDate)),
											startOfDay(new Date(rDate)),
										),
									);
									const currentRentalPrice = itemsBaseRental * days;
									const balance = Math.max(
										0,
										currentRentalPrice - Number(dPaid || 0),
									);

									return (
										<div className="flex justify-between pt-2">
											<span className="text-sm font-medium text-muted-foreground">
												Còn lại phải thu:
											</span>
											<span className="font-bold">
												{formatCurrency(balance)}
											</span>
										</div>
									);
								}}
							</form.Subscribe>
						</div>
					</div>

					<Button
						type="submit"
						size="lg"
						className="w-full font-bold"
						disabled={loading}
					>
						{loading ? "Đang tạo..." : "Xác nhận & Tạo đơn thuê"}
					</Button>
				</div>
			</form>

			<ItemPicker
				open={isItemPickerOpen}
				onOpenChange={setIsItemPickerOpen}
				selectedItems={selectedItems}
				onItemsSelect={setSelectedItems}
			/>
		</>
	);
}
