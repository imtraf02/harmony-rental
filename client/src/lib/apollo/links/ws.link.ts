import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const graphqlUrl =
	import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql";

// Convert http(s):// to ws(s)://
const wsUrl = graphqlUrl.replace(/^http/, "ws");

export const wsLink = new GraphQLWsLink(
	createClient({
		url: wsUrl,
		connectionParams: {},
		retryAttempts: Infinity,
		shouldRetry: () => true,
		on: {
			connected: () => console.log("[WS] ✅ Connected"),
			closed: (event) => console.log("[WS] 🔌 Closed", event),
			error: (error) => console.error("[WS] ❌ Error", error),
		},
	}),
);
