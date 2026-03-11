import SchemaBuilder from "@pothos/core";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import PrismaPlugin from "@pothos/plugin-prisma";
import ValidationPlugin from "@pothos/plugin-validation";
import { GraphQLError } from "graphql";
import { DateTimeResolver } from "graphql-scalars";
import type { Context } from "./context";
import { prisma } from "./db";
import type PrismaTypes from "./generated/pothos-prisma-types";
import { getDatamodel } from "./generated/pothos-prisma-types";

export const builder = new SchemaBuilder<{
	Scalars: {
		DateTime: {
			Input: Date;
			Output: Date;
		};
		File: {
			Input: File;
			Output: File;
		};
	};
	Context: Context;
	PrismaTypes: PrismaTypes;

	DefaultFieldNullability: false;
}>({
	defaultFieldNullability: false,
	plugins: [PrismaPlugin, DataloaderPlugin, ValidationPlugin],
	prisma: {
		client: prisma,
		dmmf: getDatamodel(),
	},
	validation: {
		validationError: (validationResult) => {
			return new GraphQLError("Trường không hợp lệ", {
				extensions: {
					code: "BAD_USER_INPUT",
					errors: validationResult.issues.map((issue) => ({
						field: issue.path?.join("."),
						message: issue.message,
					})),
				},
			});
		},
	},
});

builder.addScalarType("DateTime", DateTimeResolver);
builder.scalarType("File", {
	serialize: (value) => value,
	parseValue: (value) => value as File,
});

builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});
