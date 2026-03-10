import { ApolloProvider } from "@apollo/client/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { apolloClient } from "@/lib/apollo";
import "@/styles/index.css";

function initTheme() {
	try {
		const stored = window.localStorage.getItem("theme");
		const mode =
			stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(resolved);
		if (mode === "auto") {
			root.removeAttribute("data-theme");
		} else {
			root.setAttribute("data-theme", mode);
		}
		root.style.colorScheme = resolved;
	} catch {
		// ignore
	}
}

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	useEffect(() => {
		initTheme();
	}, []);

	return (
		<ApolloProvider client={apolloClient}>
			<Outlet />
			<Toaster />
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</ApolloProvider>
	);
}

