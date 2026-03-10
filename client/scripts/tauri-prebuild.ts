import { access, chmod, copyFile, mkdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

function projectRootFromClientCwd(): string {
	return resolve(import.meta.dirname, "..");
}

function targetTripleFromTauriEnv(): string | null {
	const override =
		process.env.HARMONY_TARGET_TRIPLE ??
		process.env.TAURI_ENV_TARGET_TRIPLE ??
		process.env.CARGO_BUILD_TARGET ??
		null;
	if (override) return override;

	const platform = process.env.TAURI_ENV_PLATFORM ?? "";
	const arch = process.env.TAURI_ENV_ARCH ?? "";

	if (platform.includes("windows")) {
		if (arch === "x86_64") return "x86_64-pc-windows-gnu";
		throw new Error(
			`Unsupported Windows arch for cross-build: TAURI_ENV_ARCH=${arch || "(empty)"}`,
		);
	}

	return null;
}

async function sh(
	cmd: string,
	args: string[],
	opts?: { cwd?: string; env?: Record<string, string | undefined> },
): Promise<{ stdout: string; stderr: string }> {
	const proc = Bun.spawn([cmd, ...args], {
		cwd: opts?.cwd,
		env: { ...process.env, ...(opts?.env ?? {}) },
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
		proc.exited,
	]);
	if (exitCode !== 0) {
		throw new Error(
			`Command failed (${exitCode}): ${cmd} ${args.join(" ")}\n${stderr || stdout}`,
		);
	}
	return { stdout, stderr };
}

async function rustHostTriple(): Promise<string> {
	const { stdout } = await sh("rustc", ["-vV"]);
	const hostLine = stdout
		.split("\n")
		.map((l) => l.trim())
		.find((l) => l.startsWith("host:"));
	if (!hostLine) throw new Error("Unable to determine Rust host triple from `rustc -vV`.");
	return hostLine.slice("host:".length).trim();
}

async function which(cmd: string): Promise<string | null> {
	const proc = Bun.spawn(["bash", "-lc", `command -v ${cmd}`], {
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, exitCode] = await Promise.all([
		new Response(proc.stdout).text(),
		proc.exited,
	]);
	if (exitCode !== 0) return null;
	const resolved = stdout.trim();
	return resolved.length ? resolved : null;
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	const clientRoot = projectRootFromClientCwd();
	const repoRoot = resolve(clientRoot, "..");
	const srcTauriDir = join(clientRoot, "src-tauri");
	const binDir = join(srcTauriDir, "bin");
	const resourcesDir = join(srcTauriDir, "resources");

	const triple = targetTripleFromTauriEnv() ?? (await rustHostTriple());
	const isWindowsTarget = triple.includes("windows");
	const ext = isWindowsTarget ? ".exe" : "";

	// ── 1. Prepare directories ──
	await mkdir(binDir, { recursive: true });
	await mkdir(resourcesDir, { recursive: true });

	// ── 2. Generate embedded migrations SQL ──
	console.info("[tauri-prebuild] Generating embedded migrations...");
	await sh("bun", ["run", "server/scripts/generate-migrations.ts"], { cwd: repoRoot });

	// ── 3. Bundle server into a single JS file ──
	const serverEntry = join(repoRoot, "server", "src", "index.ts");
	const bundleOut = join(resourcesDir, "server-bundle.js");
	await rm(bundleOut, { force: true });

	console.info(`[tauri-prebuild] Bundling server → ${bundleOut}`);
	await sh("bun", ["build", "--target=bun", "--outfile", bundleOut, serverEntry], {
		cwd: repoRoot,
	});

	if (!(await fileExists(bundleOut))) {
		throw new Error(`Server bundle was not created at ${bundleOut}`);
	}
	console.info("[tauri-prebuild] Server bundle OK.");

	// ── 4. Copy Bun runtime as sidecar ──
	const sidecarOut = join(binDir, `bun-${triple}${ext}`);
	await rm(sidecarOut, { force: true });

	if (isWindowsTarget && process.platform !== "win32") {
		// Cross-build: user must provide a Windows Bun executable
		const bunWindowsExe =
			process.env.HARMONY_BUN_WINDOWS_EXE ?? process.env.BUN_WINDOWS_EXE ?? null;
		if (!bunWindowsExe) {
			throw new Error(
				"Missing `HARMONY_BUN_WINDOWS_EXE` (path to bun.exe for Windows). " +
					"Required to cross-compile for Windows on non-Windows hosts.",
			);
		}
		if (!(await fileExists(bunWindowsExe))) {
			throw new Error(`HARMONY_BUN_WINDOWS_EXE not found at: ${bunWindowsExe}`);
		}
		console.info(`[tauri-prebuild] Copying Windows Bun runtime: ${bunWindowsExe} → ${sidecarOut}`);
		await copyFile(bunWindowsExe, sidecarOut);
		await chmod(sidecarOut, 0o755);
	} else {
		// Native build: resolve `bun` from PATH
		const bunPath = await which("bun");
		if (!bunPath) {
			throw new Error("Could not find `bun` in PATH. Bun is required as the backend runtime.");
		}

		// Resolve symlinks to the real binary
		const realBunPath = await Bun.file(bunPath).exists()
			? bunPath
			: null;
		if (!realBunPath) {
			throw new Error(`Resolved bun path does not exist: ${bunPath}`);
		}

		console.info(`[tauri-prebuild] Copying host Bun runtime: ${realBunPath} → ${sidecarOut}`);
		await copyFile(realBunPath, sidecarOut);
		await chmod(sidecarOut, 0o755);
	}

	console.info("[tauri-prebuild] Done ✓");
}

main().catch((err) => {
	console.error("[tauri-prebuild] Failed:", err);
	process.exit(1);
});
