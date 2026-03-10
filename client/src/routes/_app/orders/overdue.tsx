import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/orders/overdue")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_app/orders/overdue"!</div>;
}
