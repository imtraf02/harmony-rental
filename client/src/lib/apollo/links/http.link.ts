import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const graphqlUrl =
	import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql";

export const httpLink = new UploadHttpLink({
	uri: graphqlUrl,
	credentials: "include",
	headers: {
		"Apollo-Require-Preflight": "true",
	},
});
