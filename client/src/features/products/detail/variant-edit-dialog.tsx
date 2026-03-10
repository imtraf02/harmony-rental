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
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { VariantFragment } from "@/gql/graphql";
import { updateProductVariant } from "../graphql/mutations";
import { productQuery } from "../graphql/queries";
import { ImageUpload } from "@/components/image-upload";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	variant: VariantFragment;
}

const formSchema = z.object({
	size: z.string().min(1, "Vui lòng nhập kích cỡ"),
	color: z.string().min(1, "Vui lòng nhập màu sắc"),
	rentalPrice: z.number().min(0, "Giá thuê không được âm"),
	deposit: z.number().min(0, "Tiền cọc không được âm"),
	image: z.instanceof(File).nullable(),
	imageUrl: z.string(),
});

export function VariantEditDialog({ open, onOpenChange, variant }: Props) {
	const [mutate, { loading }] = useMutation(updateProductVariant, {
		refetchQueries: [{ query: productQuery, variables: { id: variant.productId } }],
		onCompleted: () => {
			toast.success("Cập nhật biến thể thành công");
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message),
	});

	const form = useForm({
		defaultValues: {
			size: variant.size,
			color: variant.color,
			rentalPrice: variant.rentalPrice,
			deposit: variant.deposit,
			image: null as File | null,
			imageUrl: variant.imageUrl || "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			const { image, ...data } = value;
			await mutate({
				variables: {
					id: variant.id,
					input: {
						...data,
						image,
					},
				},
			});
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form
					id="variant-edit-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Chỉnh sửa biến thể</DialogTitle>
						<DialogDescription>
							Cập nhật thông tin cho biến thể này.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<div className="flex justify-center mb-4">
							<form.Field name="image">
								{(field) => (
									<ImageUpload
										value={form.getFieldValue("imageUrl")}
										file={field.state.value}
										onChange={(val) => {
											if (val instanceof File) {
												field.handleChange(val);
												form.setFieldValue("imageUrl", "");
											} else {
												field.handleChange(null);
												form.setFieldValue("imageUrl", val || "");
											}
										}}
									/>
								)}
							</form.Field>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<form.Field name="color">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>Màu sắc</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								)}
							</form.Field>

							<form.Field name="size">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>Kích cỡ</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								)}
							</form.Field>
						</div>

						<form.Field name="rentalPrice">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Giá thuê (VNĐ)</FieldLabel>
									<Input
										id={field.name}
										type="number"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							)}
						</form.Field>

						<form.Field name="deposit">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Tiền cọc (VNĐ)</FieldLabel>
									<Input
										id={field.name}
										type="number"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							)}
						</form.Field>
					</FieldGroup>

					<DialogFooter>
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
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
