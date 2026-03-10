import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { httpLink } from "./links/http.link";

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {},
			},
		},
	}),
	link: ApolloLink.from([httpLink]),
});
