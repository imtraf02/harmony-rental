import { createFileRoute } from "@tanstack/react-router";
import { OrderDetail } from "@/features/orders";

export const Route = createFileRoute("/_app/orders/$id")({
	component: OrderDetail,
});
