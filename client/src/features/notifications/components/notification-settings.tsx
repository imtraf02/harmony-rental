import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";
import { Button } from "@/components/ui/button";
import { Minus, Plus, BellRing } from "lucide-react";

export function NotificationSettings() {
	const { dueSoonDays, setDueSoonDays } = useSettingsStore();

	const increment = () => setDueSoonDays(Math.min(dueSoonDays + 1, 30));
	const decrement = () => setDueSoonDays(Math.max(dueSoonDays - 1, 1));

	return (
		<div className="space-y-5 py-2">
			<div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3 decoration-primary/50">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<BellRing className="size-5" />
				</div>
				<div className="flex-1">
					<p className="text-sm font-semibold">Thời gian nhắc nhở</p>
					<p className="text-[11px] text-muted-foreground">
						Cảnh báo đơn hàng sắp đến hạn
					</p>
				</div>
			</div>

			<div className="grid gap-3">
				<div className="flex items-center justify-between">
					<Label htmlFor="due-soon-days" className="font-medium">
						Số ngày báo trước
					</Label>
					<span className="flex h-6 items-center justify-center rounded-full bg-primary/10 px-2 text-[11px] font-bold text-primary">
						{dueSoonDays} ngày
					</span>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon-sm"
						onClick={decrement}
						disabled={dueSoonDays <= 1}
						className="h-9 w-9 rounded-xl transition-all active:scale-90"
					>
						<Minus className="size-4" />
					</Button>
					<div className="flex h-9 flex-1 items-center justify-center rounded-xl border bg-background font-mono text-sm font-bold shadow-sm">
						{dueSoonDays}
					</div>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={increment}
						disabled={dueSoonDays >= 30}
						className="h-9 w-9 rounded-xl transition-all active:scale-90"
					>
						<Plus className="size-4" />
					</Button>
				</div>

				<p className="px-1 text-[11px] leading-relaxed text-muted-foreground italic">
					Hệ thống sẽ tự động quét và hiển thị các đơn hàng có ngày trả trong vòng{" "}
					<span className="font-semibold text-foreground">{dueSoonDays} ngày</span> tới.
				</p>
			</div>
		</div>
	);
}
