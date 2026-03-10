import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { createCustomer, customersQuery } from "../graphql";

interface CustomersCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên khách hàng"),
	phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
	address: z.string(),
	note: z.string(),
});

export function CustomersCreateDialog({
	open,
	onOpenChange,
}: CustomersCreateDialogProps) {
	const [mutate, { loading }] = useMutation(createCustomer, {
		onCompleted: () => {
			toast.success("Thêm khách hàng thành công");
			onOpenChange(false);
			form.reset();
		},
		onError: (err) => {
			toast.error(err.message || "Đã có lỗi xảy ra");
		},
		refetchQueries: [{ query: customersQuery }],
	});

	const form = useForm({
		defaultValues: {
			name: "",
			phone: "",
			address: "",
			note: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await mutate({
				variables: {
					input: {
						name: value.name,
						phone: value.phone,
						address: value.address,
						note: value.note,
					},
				},
			});
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Thêm khách hàng mới</DialogTitle>
						<DialogDescription>
							Nhập thông tin khách hàng mới vào hệ thống.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<form.Field name="name">
							{(field) => (
								<div className="grid gap-2">
									<label htmlFor={field.name} className="text-sm font-medium">
										Họ và tên
									</label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Nguyễn Văn A"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>
						<form.Field name="phone">
							{(field) => (
								<div className="grid gap-2">
									<label htmlFor={field.name} className="text-sm font-medium">
										Số điện thoại
									</label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="0xxxxxxxxx"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>
						<form.Field name="address">
							{(field) => (
								<div className="grid gap-2">
									<label htmlFor={field.name} className="text-sm font-medium">
										Địa chỉ
									</label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Địa chỉ khách hàng"
									/>
								</div>
							)}
						</form.Field>
						<form.Field name="note">
							{(field) => (
								<div className="grid gap-2">
									<label htmlFor={field.name} className="text-sm font-medium">
										Ghi chú
									</label>
									<InputGroup>
										<InputGroupTextarea
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Thông tin thêm..."
										/>
									</InputGroup>
								</div>
							)}
						</form.Field>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Đang thêm..." : "Thêm khách hàng"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
