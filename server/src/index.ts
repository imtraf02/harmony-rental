import { resolve, sep } from "node:path";
import { createYoga } from "graphql-yoga";
import { applyEmbeddedMigrations } from "./bootstrap/migrate";
import { createContext } from "./context";
import { env } from "./env";
import { schema } from "./schema";

function safeUploadsPath(uploadsDir: string, requestPathname: string): string | null {
	// Prevent path traversal: only allow paths under UPLOADS_DIR.
	const rel = requestPathname.replace(/^\/uploads\//, "");
	const root = resolve(uploadsDir);
	const full = resolve(root, rel);
	return full === root || full.startsWith(root + sep) ? full : null;
}

async function main() {
	console.info("Starting server...");
	console.info("Environment variables loaded.");

	if (env.AUTO_DB_INIT) {
		console.info("Applying embedded database migrations (if needed)...");
		await applyEmbeddedMigrations(env.DATABASE_URL);
		console.info("Database migrations OK.");
	}

	const yoga = createYoga({
		schema: schema,
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
