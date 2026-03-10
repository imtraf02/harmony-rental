import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		PORT: z.coerce.number().default(4000),
		NODE_ENV: z.enum(["development", "production"]).default("development"),
		UPLOADS_DIR: z.string().optional(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
