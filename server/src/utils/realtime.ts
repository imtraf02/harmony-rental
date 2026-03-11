import { createClient } from "@supabase/supabase-js";
import { env } from "../env";
import { pubsub } from "./pubsub";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

interface OrderRecord {
	id: string;
}

interface PaymentRecord {
	id: string;
	order_id?: string;
	orderId?: string;
}

export function initRealtime() {
	console.info(`[Realtime] Initializing with URL: ${env.SUPABASE_URL}`);

	const channel = supabase.channel("db-changes");

	// Handle Order changes
	for (const event of ["INSERT", "UPDATE", "DELETE"] as const) {
		channel.on<OrderRecord>(
			"postgres_changes",
			{
				event,
				schema: "public",
				table: "orders",
			},
			(payload) => {
				console.log(
					`[Realtime] Order ${event} Payload:`,
					JSON.stringify(payload, null, 2),
				);

				const newData = payload.new;
				const oldData = payload.old;
				const id =
					(newData && "id" in newData ? newData.id : null) ||
					(oldData && "id" in oldData ? oldData.id : null);

				if (id) {
					console.log(`[Realtime] Publishing orderUpdated for ID: ${id}`);
					pubsub.publish("orderUpdated", {
						id,
						event: payload.eventType,
					});
				}
			},
		);
	}

	// Handle Payment changes
	for (const event of ["INSERT", "UPDATE", "DELETE"] as const) {
		channel.on<PaymentRecord>(
			"postgres_changes",
			{
				event,
				schema: "public",
				table: "payments",
			},
			(payload) => {
				console.log(
					`[Realtime] Payment ${event} Payload:`,
					JSON.stringify(payload, null, 2),
				);

				const newData = payload.new;
				const oldData = payload.old;

				const orderId =
					(newData && "orderId" in newData ? newData.orderId : null) ||
					(newData && "order_id" in newData ? newData.order_id : null) ||
					(oldData && "orderId" in oldData ? oldData.orderId : null) ||
					(oldData && "order_id" in oldData ? oldData.order_id : null);

				if (orderId) {
					console.log(
						`[Realtime] Publishing orderUpdated for orderId: ${orderId}`,
					);
					pubsub.publish("orderUpdated", {
						id: orderId,
						event: `PAYMENT_${payload.eventType}`,
					});
				}
			},
		);
	}

	channel.subscribe((status, err) => {
		console.info(`[Realtime] Subscription status: ${status}`);
		if (err) {
			console.error("[Realtime] Subscription error:", err);
		}
		if (status === "SUBSCRIBED") {
			console.info("[Realtime] Successfully connected to Supabase Realtime");
		}
	});
}
