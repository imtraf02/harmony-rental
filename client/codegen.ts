import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "http://localhost:4000/graphql",
	documents: "src/**/*.{ts,tsx}",
	generates: {
		"src/gql/": {
			preset: "client",
			presetConfig: {
				fragmentMasking: false,
			},
			plugins: [],
			config: {
				scalars: {
					DateTime: "string",
					File: "File",
				},
			},
		},
	},
};

export default config;
