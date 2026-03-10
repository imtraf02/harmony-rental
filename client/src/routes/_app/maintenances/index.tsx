import { createFileRoute } from "@tanstack/react-router";
import { Maintenances } from "@/features/maintenances";

export const Route = createFileRoute("/_app/maintenances/")({
	component: Maintenances,
});
