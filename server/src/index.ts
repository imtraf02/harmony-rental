import { resolve, sep } from "node:path";
import dotenv from "dotenv";
import { createYoga } from "graphql-yoga";
import { applyEmbeddedMigrations } from "./bootstrap/migrate";

function safeUploadsPath(uploadsDir: string, requestPathname: string): string | null {
	// Prevent path traversal: only allow paths under UPLOADS_DIR.
	const rel = requestPathname.replace(/^\/uploads\//, "");
	const root = resolve(uploadsDir);
	const full = resolve(root, rel);
	return full === root || full.startsWith(root + sep) ? full : null;
}

async function main() {
	const envFile = process.env.ENV_FILE;
	if (envFile) {
		dotenv.config({ path: envFile });
	}

	const [{ createContext }, { env }, { schema }] = await Promise.all([
		import("./context"),
		import("./env"),
		import("./schema"),
	]);

	if (env.AUTO_DB_INIT) {
		console.info("Applying embedded database migrations (if needed)...");
		await applyEmbeddedMigrations(env.DATABASE_URL);
		console.info("Database migrations OK.");
	}

	const yoga = createYoga({
		schema,
		context: createContext,
	});

	const server = Bun.serve({
		port: env.PORT,
		fetch(req) {
			const url = new URL(req.url);
			if (url.pathname.startsWith("/uploads/")) {
				const uploadsDir = env.UPLOADS_DIR ?? "public/uploads";
				const filePath = safeUploadsPath(uploadsDir, url.pathname);
				if (!filePath) return new Response("Invalid upload path", { status: 400 });
				return new Response(Bun.file(filePath));
			}
			return yoga(req);
		},
	});

	console.info(
		`Server is running on ${new URL(
			yoga.graphqlEndpoint,
			`http://${server.hostname}:${server.port}`,
		)}`,
	);
}

main().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
