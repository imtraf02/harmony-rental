import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import type { CategoryFragment } from "@/gql/graphql";
import { updateCategory } from "../graphql";

interface CategoriesEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: CategoryFragment | null;
}

const formSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên danh mục"),
	description: z.string().min(1, "Vui lòng nhập mô tả danh mục"),
});

export function CategoriesEditDialog({
	open,
	onOpenChange,
	currentRow,
}: CategoriesEditDialogProps) {
	const [mutate, { loading }] = useMutation(updateCategory, {
		onCompleted: () => {
			toast.success("Cập nhật danh mục thành công");
			onOpenChange(false);
		},
		onError: (err) => {
			toast.error(err.message || "Đã có lỗi xảy ra");
		},
	});

	const form = useForm({
		defaultValues: {
			name: currentRow?.name || "",
			description: currentRow?.description || "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			if (!currentRow) return;
			await mutate({
				variables: {
					id: currentRow.id,
					input: {
						name: value.name,
						description: value.description,
					},
				},
			});
		},
	});

	useEffect(() => {
		if (currentRow) {
			form.reset({
				name: currentRow.name,
				description: currentRow.description,
			});
		}
	}, [currentRow, form]);

	if (!currentRow) return null;

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
						<DialogTitle>Chỉnh sửa danh mục</DialogTitle>
						<DialogDescription>
							Thay đổi thông tin cho danh mục.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<form.Field name="name">
							{(field) => {
								const isInvalid = !!field.state.meta.errors.length;
								return (
									<div className="grid gap-2">
										<label htmlFor={field.name} className="text-sm font-medium">
											Tên danh mục
										</label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Nhập tên mới..."
											aria-invalid={isInvalid}
											autoFocus
										/>
										{isInvalid && (
											<p className="text-xs text-destructive">
												{field.state.meta.errors[0]?.message}
											</p>
										)}
									</div>
								);
							}}
						</form.Field>
						<form.Field name="description">
							{(field) => {
								const isInvalid = !!field.state.meta.errors.length;
								return (
									<div className="grid gap-2">
										<label htmlFor={field.name} className="text-sm font-medium">
											Mô tả
										</label>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Mô tả về danh mục này..."
											aria-invalid={isInvalid}
										/>
										{isInvalid && (
											<p className="text-xs text-destructive">
												{field.state.meta.errors[0]?.message}
											</p>
										)}
									</div>
								);
							}}
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
							{loading ? "Đang lưu..." : "Lưu thay đổi"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
