import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { httpLink } from "./links/http.link";
import { wsLink } from "./links/ws.link";

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {},
			},
		},
	}),
	link: split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === "OperationDefinition" &&
				definition.operation === "subscription"
			);
		},
		wsLink,
		httpLink,
	),
});
