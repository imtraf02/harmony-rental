import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";

export function ThemeSwitcher() {
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => {
		const themeColor = resolvedTheme === "dark" ? "#020817" : "#fff";
		const metaThemeColor = document.querySelector("meta[name='theme-color']");
		if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
	}, [resolvedTheme]);

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (
				(e.key === "d" || e.key === "D") &&
				!e.metaKey &&
				!e.ctrlKey &&
				!e.altKey
			) {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}
				e.preventDefault();
				toggleTheme();
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [toggleTheme]);

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="scale-95 rounded-full"
						onClick={toggleTheme}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="size-[1.2rem]"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
							<path d="M12 3l0 18" />
							<path d="M12 9l4.65 -4.65" />
							<path d="M12 14.3l7.37 -7.37" />
							<path d="M12 19.6l8.85 -8.85" />
						</svg>
						<span className="sr-only">Toggle theme</span>
					</Button>
				}
			/>
			<TooltipContent className="flex items-center gap-2">
				Thay đổi chủ đề <kbd className="rounded border px-1 text-xs">D</kbd>
			</TooltipContent>
		</Tooltip>
	);
}
