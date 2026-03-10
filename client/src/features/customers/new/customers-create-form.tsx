import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { createCustomer, customersQuery } from "../graphql";

const formSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên khách hàng"),
	phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
	address: z.string(),
	note: z.string(),
});

export function CustomersCreateForm() {
	const navigate = useNavigate();

	const [mutate, { loading }] = useMutation(createCustomer, {
		onCompleted: () => {
			toast.success("Thêm khách hàng thành công");
			navigate({ to: "/customers" });
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
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin khách hàng</CardTitle>
					<CardDescription>
						Nhập thông tin cơ bản của khách hàng để lưu vào hệ thống.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.Field name="name">
							{(field) => (
								<Field>
									<FieldLabel>Họ và tên</FieldLabel>
									<FieldGroup>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Nguyễn Văn A"
										/>
									</FieldGroup>
									{field.state.meta.errors.length > 0 && (
										<FieldError>{String(field.state.meta.errors[0])}</FieldError>
									)}
								</Field>
							)}
						</form.Field>
						<form.Field name="phone">
							{(field) => (
								<Field>
									<FieldLabel>Số điện thoại</FieldLabel>
									<FieldGroup>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="0xxxxxxxxx"
										/>
									</FieldGroup>
									{field.state.meta.errors.length > 0 && (
										<FieldError>{String(field.state.meta.errors[0])}</FieldError>
									)}
								</Field>
							)}
						</form.Field>
					</div>
					<form.Field name="address">
						{(field) => (
							<Field>
								<FieldLabel>Địa chỉ</FieldLabel>
								<FieldGroup>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Nhập địa chỉ của khách hàng"
									/>
								</FieldGroup>
							</Field>
						)}
					</form.Field>
					<form.Field name="note">
						{(field) => (
							<Field>
								<FieldLabel>Ghi chú</FieldLabel>
								<InputGroup>
									<InputGroupTextarea
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Thông tin thêm về sở thích, lưu ý của khách hàng..."
									/>
								</InputGroup>
							</Field>
						)}
					</form.Field>
				</CardContent>
				<CardFooter className="flex justify-end gap-2 border-t pt-6 mt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate({ to: "/customers" })}
					>
						Hủy
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Đang xử lý..." : "Lưu khách hàng"}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
