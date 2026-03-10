import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { DatePickerField } from "@/components/date-picker-field";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type OrderFragment, OrderStatus } from "@/gql/graphql";
import { ordersQuery, updateOrder } from "../graphql";
import { getOrderStatusConfig } from "./orders-columns";

interface OrderEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: OrderFragment;
}

const statusOptions = Object.values(OrderStatus).map((s) => ({
	value: s,
	label: getOrderStatusConfig(s).label,
}));

const orderSchema = z.object({
	rentalDate: z.string().nullable(),
	returnDate: z.string().nullable(),
	returnedAt: z.string().nullable(),
	eventDate: z.string().nullable(),
	status: z.nativeEnum(OrderStatus),
	depositPaid: z.number().min(0),
	totalAmount: z.number().min(0),
	lateFee: z.number().min(0),
	damageFee: z.number().min(0),
	note: z.string().nullable(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export function OrderEditDialog({
	open,
	onOpenChange,
	currentRow,
}: OrderEditDialogProps) {
	const statusItems =
		currentRow.status === OrderStatus.Returned &&
		currentRow.paymentStatus === "PAID"
			? statusOptions.filter((option) => option.value !== OrderStatus.Cancelled)
			: statusOptions;

	const [mutate, { loading }] = useMutation(updateOrder, {
		refetchQueries: [{ query: ordersQuery }],
	});

	const form = useForm({
		defaultValues: {
			rentalDate: currentRow.rentalDate
				? new Date(currentRow.rentalDate).toISOString().split("T")[0]
				: null,
			returnDate: currentRow.returnDate
				? new Date(currentRow.returnDate).toISOString().split("T")[0]
				: null,
			returnedAt: currentRow.returnedAt
				? new Date(currentRow.returnedAt).toISOString().split("T")[0]
				: null,
			eventDate: currentRow.eventDate
				? new Date(currentRow.eventDate).toISOString().split("T")[0]
				: null,
			status: currentRow.status,
			depositPaid: currentRow.depositPaid,
			totalAmount: currentRow.totalAmount,
			lateFee: currentRow.lateFee || 0,
			damageFee: currentRow.damageFee || 0,
			note: currentRow.note || "",
		} as OrderFormValues,
		validators: {
			onSubmit: orderSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const input = {
					...value,
					rentalDate: value.rentalDate
						? new Date(value.rentalDate).toISOString()
						: null,
					returnDate: value.returnDate
						? new Date(value.returnDate).toISOString()
						: null,
					returnedAt: value.returnedAt
						? new Date(value.returnedAt).toISOString()
						: null,
					eventDate: value.eventDate
						? new Date(value.eventDate).toISOString()
						: null,
				};

				await mutate({
					variables: {
						id: currentRow.id,
						input,
					},
				});
				toast.success("Đã cập nhật đơn hàng");
				onOpenChange(false);
			} catch (e: unknown) {
				const error = e as Error;
				toast.error(error.message || "Lỗi khi cập nhật");
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				rentalDate: currentRow.rentalDate
					? new Date(currentRow.rentalDate).toISOString().split("T")[0]
					: null,
				returnDate: currentRow.returnDate
					? new Date(currentRow.returnDate).toISOString().split("T")[0]
					: null,
				returnedAt: currentRow.returnedAt
					? new Date(currentRow.returnedAt).toISOString().split("T")[0]
					: null,
				eventDate: currentRow.eventDate
					? new Date(currentRow.eventDate).toISOString().split("T")[0]
					: null,
				status: currentRow.status,
				depositPaid: currentRow.depositPaid,
				totalAmount: currentRow.totalAmount,
				lateFee: currentRow.lateFee || 0,
				damageFee: currentRow.damageFee || 0,
				note: currentRow.note || "",
			});
		}
	}, [currentRow, open, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Chỉnh sửa đơn hàng {currentRow.code}</DialogTitle>
					<DialogDescription>
						Cập nhật thông tin ngày hẹn, thực tế và trạng thái của đơn hàng.
					</DialogDescription>
				</DialogHeader>

				<form
					className="grid grid-cols-2 gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field name="status">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Trạng thái đơn</FieldLabel>
								<Select
									items={statusItems}
									value={field.state.value}
									onValueChange={(val: string | null) =>
										val && field.handleChange(val as OrderStatus)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn trạng thái" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{statusItems.map((opt) => (
												<SelectItem key={opt.value} value={opt.value}>
													{opt.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
						)}
					</form.Field>

					<form.Field name="rentalDate">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Ngày thuê</FieldLabel>
								<DatePickerField
									value={field.state.value}
									onChange={(val) => field.handleChange(val)}
									nullable
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="returnDate">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Ngày hẹn trả</FieldLabel>
								<DatePickerField
									value={field.state.value}
									onChange={(val) => field.handleChange(val)}
									nullable
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="returnedAt">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Ngày trả thực tế</FieldLabel>
								<DatePickerField
									value={field.state.value}
									onChange={(val) => field.handleChange(val)}
									nullable
									placeholder="Chưa trả đồ"
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="eventDate">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Ngày sự kiện</FieldLabel>
								<DatePickerField
									value={field.state.value}
									onChange={(val) => field.handleChange(val)}
									nullable
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="depositPaid">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Tiền khách đã trả/cọc</FieldLabel>
								<div className="flex gap-2">
									<input
										type="number"
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										value={field.state.value ?? 0}
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>
								</div>
							</Field>
						)}
					</form.Field>

					<form.Field name="totalAmount">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Tổng tiền đơn hàng</FieldLabel>
								<input
									type="number"
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									value={field.state.value ?? 0}
									onChange={(e) => field.handleChange(Number(e.target.value))}
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="lateFee">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Phí quá hạn</FieldLabel>
								<input
									type="number"
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									value={field.state.value ?? 0}
									onChange={(e) => field.handleChange(Number(e.target.value))}
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="damageFee">
						{(field) => (
							<Field className="col-span-1">
								<FieldLabel>Phí hư hại/mất mát</FieldLabel>
								<input
									type="number"
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									value={field.state.value ?? 0}
									onChange={(e) => field.handleChange(Number(e.target.value))}
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="note">
						{(field) => (
							<Field className="col-span-2">
								<FieldLabel>Ghi chú</FieldLabel>
								<InputGroup>
									<InputGroupTextarea
										value={field.state.value ?? ""}
										onInput={(e) => field.handleChange(e.currentTarget.value)}
										rows={3}
									/>
								</InputGroup>
							</Field>
						)}
					</form.Field>

					<div className="col-span-2 flex justify-end gap-2 mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Đang lưu..." : "Lưu thay đổi"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
