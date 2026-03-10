import dotenv from "dotenv";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// Load .env file BEFORE validation.
// In production (Tauri desktop), the Rust shell sets ENV_FILE to the
// user-specific .env path.  We must populate process.env from that file
// before createEnv() runs its validation.
const envFile = process.env.ENV_FILE;
if (envFile) {
	dotenv.config({ path: envFile, override: true });
} else {
	// Fallback: load .env from cwd (for local dev)
	dotenv.config();
}

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		PORT: z.coerce.number().default(4000),
		NODE_ENV: z.enum(["development", "production"]).default("development"),
		UPLOADS_DIR: z.string().optional(),
		AUTO_DB_INIT: z.coerce.boolean().default(false),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
