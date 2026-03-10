import { createFileRoute } from "@tanstack/react-router";
import { UnpaidPayments } from "@/features/payments";

export const Route = createFileRoute("/_app/payments/unpaid")({
	component: UnpaidPayments,
});
