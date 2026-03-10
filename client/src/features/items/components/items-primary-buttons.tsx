import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useItems } from "./items-provider";

export function ItemsPrimaryButtons() {
	const { setOpen } = useItems();

	return (
		<Button onClick={() => setOpen("create")}>
			<IconPlus className="mr-2 h-4 w-4" />
			Thêm sản phẩm
		</Button>
	);
}
