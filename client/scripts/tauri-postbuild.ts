import { readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function clientRoot(): string {
	// Invoked from Tauri hook commands where CWD may be `src-tauri`.
	return resolve(import.meta.dirname, "..");
}

function pickFirst(files: string[], prefix: string, suffix: string): string | null {
	return (
		files
			.filter((f) => f.startsWith(prefix) && f.endsWith(suffix))
			.sort()[0] ?? null
	);
}

async function main() {
	const root = clientRoot();
	const distClientDir = join(root, "dist", "client");
	const assetsDir = join(distClientDir, "assets");
	const files = await readdir(assetsDir);

	// TanStack Start builds hashed asset filenames; pick an entry chunk.
	// This keeps Tauri's `frontendDist` happy by ensuring an `index.html` exists.
	const mainJs =
		pickFirst(files, "main-", ".js") ??
		pickFirst(files, "index-", ".js") ??
		files.filter((f) => f.endsWith(".js")).sort()[0] ??
		null;
	if (!mainJs) {
		throw new Error(
			`Unable to locate a JS entry chunk in ${assetsDir} (expected at least one *.js file).`,
		);
	}

	const cssFiles = files.filter((f) => f.endsWith(".css")).sort();
	const cssLinks = cssFiles
		.map((f) => `    <link rel="stylesheet" href="./assets/${f}" />`)
		.join("\n");

	const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Harmony Wedding Rental</title>
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/${mainJs}"></script>
  </body>
</html>
`;

	await writeFile(join(distClientDir, "index.html"), html, "utf8");
	console.info(`[tauri-postbuild] Wrote ${join(distClientDir, "index.html")}`);
}

main().catch((err) => {
	console.error("[tauri-postbuild] Failed:", err);
	process.exit(1);
});
