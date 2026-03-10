import { createFileRoute } from "@tanstack/react-router";
import { Payments } from "@/features/payments";

export const Route = createFileRoute("/_app/payments/")({
	component: Payments,
});
