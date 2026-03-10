import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type ItemFragment, ItemStatus } from "@/gql/graphql";
import { updateItem } from "../graphql";

interface ItemsEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: ItemFragment;
}

const statusOptions: { value: ItemStatus; label: string }[] = [
	{ value: ItemStatus.Available, label: "Sẵn sàng" },
	{ value: ItemStatus.Rented, label: "Đang thuê" },
	{ value: ItemStatus.Maintenance, label: "Bảo trì" },
];

export function ItemsEditDialog({
	open,
	onOpenChange,
	currentRow,
}: ItemsEditDialogProps) {
	const [mutate, { loading }] = useMutation(updateItem, {
		onCompleted: () => {
			toast.success("Cập nhật sản phẩm thành công");
			onOpenChange(false);
		},
		onError: (err) => {
			toast.error(err.message || "Đã có lỗi xảy ra");
		},
	});

	const form = useForm({
		defaultValues: {
			code: currentRow.code,
			status: currentRow.status,
			note: currentRow.note || "",
		},
		validators: {
			onSubmit: z.object({
				code: z.string().min(1, "Vui lòng nhập mã sản phẩm"),
				status: z.enum([
					ItemStatus.Available,
					ItemStatus.Rented,
					ItemStatus.Maintenance,
				]),
				note: z.string(),
			}),
		},
		onSubmit: async ({ value }) => {
			if (!currentRow) return;
			await mutate({
				variables: {
					id: currentRow.id,
					input: {
						code: value.code,
						status: value.status,
						note: value.note,
					},
				},
			});
		},
	});

	if (!currentRow) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form
					id="item-edit-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
						<DialogDescription>
							Thay đổi thông tin cho sản phẩm {currentRow.code}.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<FieldGroup>
							<form.Field name="code">
								{(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Mã sản phẩm</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="VD: VC-001"
												aria-invalid={isInvalid}
												autoFocus
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="status">
								{(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Trạng thái</FieldLabel>
											<Select
												items={statusOptions}
												value={field.state.value}
												onValueChange={(v: string | null) => {
													if (v) field.handleChange(v as ItemStatus);
												}}
											>
												<SelectTrigger id={field.name} aria-invalid={isInvalid}>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{statusOptions.map((opt) => (
															<SelectItem key={opt.value} value={opt.value}>
																{opt.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="note">
								{(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Ghi chú</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Ghi chú về tình trạng đồ..."
												aria-invalid={isInvalid}
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Hủy
						</Button>
						<Button type="submit" form="item-edit-form" disabled={loading}>
							{loading ? "Đang lưu..." : "Lưu thay đổi"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
