import type { Reference } from "@apollo/client";
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
	FieldLabel, 
	FieldGroup,
	FieldDescription 
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { 
	InputGroup, 
	InputGroupTextarea 
} from "@/components/ui/input-group";
import { createCategory } from "../graphql";

interface CategoriesCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên danh mục"),
	description: z.string().min(1, "Vui lòng nhập mô tả danh mục"),
});

export function CategoriesCreateDialog({
	open,
	onOpenChange,
}: CategoriesCreateDialogProps) {
	const [mutate, { loading }] = useMutation(createCategory, {
		update(cache, { data }) {
			const newCategory = data?.createCategory;
			if (!newCategory) return;

			cache.modify<{
				categories: readonly Reference[];
			}>({
				fields: {
					categories(existingRefs = [], { toReference }) {
						const newRef = toReference(newCategory);
						if (!newRef) return existingRefs;
						return [...existingRefs, newRef];
					},
				},
			});

			toast.success("Thêm danh mục thành công");
			onOpenChange(false);
			form.reset();
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await mutate({
				variables: {
					input: {
						...value,
					},
				},
			});
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form
					id="category-create-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Thêm danh mục mới</DialogTitle>
						<DialogDescription>
							Nhập tên cho danh mục sản phẩm mới.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<FieldGroup>
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Tên danh mục</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Ví dụ: Váy cưới, Phụ kiện..."
												aria-invalid={isInvalid}
												autoFocus
											/>
											<FieldDescription>
												Tên đại diện cho mẫu sản phẩm này.
											</FieldDescription>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="description">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Mô tả</FieldLabel>
											<InputGroup>
												<InputGroupTextarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Mô tả về danh mục này..."
													aria-invalid={isInvalid}
													className="min-h-[100px]"
												/>
											</InputGroup>
											<FieldDescription>
												Thông tin sơ lược về danh mục.
											</FieldDescription>
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
						<Button type="submit" form="category-create-form" disabled={loading}>
							{loading ? "Đang xử lý..." : "Thêm danh mục"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
