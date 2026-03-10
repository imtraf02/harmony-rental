import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "./categories-provider";

export function CategoriesPrimaryButtons() {
	const { setOpen } = useCategories();

	return (
		<Button onClick={() => setOpen("create")}>
			<IconPlus className="mr-2 h-4 w-4" />
			Thêm danh mục
		</Button>
	);
}
