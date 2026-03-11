import { resolve, sep } from "node:path";
import type { ExecutionArgs } from "graphql";
import type { OperationResult } from "graphql-ws";
import { makeHandler } from "graphql-ws/use/bun";
import { createYoga } from "graphql-yoga";
import { applyEmbeddedMigrations } from "./bootstrap/migrate";
import { createContext } from "./context";
import { env } from "./env";
import { schema } from "./schema";
import { initRealtime } from "./utils/realtime";

function safeUploadsPath(
	uploadsDir: string,
	requestPathname: string,
): string | null {
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

	initRealtime();

	const yoga = createYoga({
		schema: schema,
		context: createContext,
		logging: true,
		cors: {
			origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
			credentials: true,
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: [
				"Content-Type",
				"Accept",
				"Authorization",
				"apollo-require-preflight",
			],
		},
	});

	// graphql-ws handler for Bun WebSocket
	const wsHandler = makeHandler({
		execute: (args: ExecutionArgs) => {
			const { execute } = args.rootValue as {
				execute: (args: ExecutionArgs) => OperationResult;
			};
			return execute(args);
		},
		subscribe: (args: ExecutionArgs) => {
			const { subscribe } = args.rootValue as {
				subscribe: (args: ExecutionArgs) => OperationResult;
			};
			return subscribe(args);
		},
		onSubscribe: async (ctx, _id, params) => {
			const { schema, execute, subscribe, contextFactory, parse, validate } =
				yoga.getEnveloped({
					...ctx,
					req: ctx.extra.request,
					socket: ctx.extra.socket,
					params,
				});

			const args = {
				schema,
				operationName: params.operationName,
				document: parse(params.query),
				variableValues: params.variables,
				contextValue: await contextFactory(),
				rootValue: {
					execute,
					subscribe,
				},
			};

			const errors = validate(args.schema, args.document);
			if (errors.length) return errors;
			return args;
		},
	});

	const server = Bun.serve({
		port: env.PORT,
		fetch(req, server) {
			const url = new URL(req.url);

			if (url.pathname.startsWith("/uploads/")) {
				const uploadsDir = env.UPLOADS_DIR ?? "public/uploads";
				const filePath = safeUploadsPath(uploadsDir, url.pathname);
				if (!filePath)
					return new Response("Invalid upload path", { status: 400 });
				return new Response(Bun.file(filePath));
			}

			// Upgrade to WebSocket for subscription requests
			const upgradeHeader = req.headers.get("upgrade");
			if (
				upgradeHeader === "websocket" &&
				url.pathname === yoga.graphqlEndpoint
			) {
				if (server.upgrade(req)) {
					return undefined as unknown as Response;
				}
				return new Response("WebSocket upgrade failed", { status: 400 });
			}

			return yoga(req);
		},
		websocket: wsHandler,
	});

	console.info(
		`Server is running on ${new URL(
			yoga.graphqlEndpoint,
			`http://${server.hostname}:${server.port}`,
		)}`,
	);
	console.info(
		`WebSocket subscriptions available at ws://${server.hostname}:${server.port}${yoga.graphqlEndpoint}`,
	);
}

main().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
