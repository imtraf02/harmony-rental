import { access, copyFile, mkdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

function projectRootFromClientCwd(): string {
	// This script is invoked via `bun run scripts/tauri-prebuild.ts` from the client package.
	// Keep paths stable and explicit to avoid surprises in Tauri's `beforeBuildCommand`.
	return resolve(import.meta.dirname, "..");
}

function targetTripleFromTauriEnv(): string | null {
	// Tauri CLI sets these env vars for hook commands (beforeBuildCommand/beforeDevCommand).
	// They don't include the full Rust triple, so we map conservatively.
	const override =
		process.env.HARMONY_TARGET_TRIPLE ??
		process.env.TAURI_ENV_TARGET_TRIPLE ??
		process.env.CARGO_BUILD_TARGET ??
		null;
	if (override) return override;

	const platform = process.env.TAURI_ENV_PLATFORM ?? "";
	const arch = process.env.TAURI_ENV_ARCH ?? "";

	// Expected values per Tauri CLI changelog: values match the target triple more accurately.
	// We only support the one cross-build case requested (Windows x86_64 on Linux).
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
	// `rustc -vV` prints `host: <triple>`.
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

function parseGccSearchDirs(output: string): { libraries: string[] } {
	// Example:
	// libraries: =/nix/store/.../lib/gcc/...:/nix/store/.../x86_64-w64-mingw32/lib
	const librariesLine = output
		.split("\n")
		.map((l) => l.trim())
		.find((l) => l.startsWith("libraries:"));
	if (!librariesLine) return { libraries: [] };
	const eqIdx = librariesLine.indexOf("=");
	if (eqIdx === -1) return { libraries: [] };
	const paths = librariesLine
		.slice(eqIdx + 1)
		.split(":")
		.map((p) => p.trim())
		.filter(Boolean);
	return { libraries: paths };
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function ensureWindowsPthreadShim(srcTauriDir: string) {
	const winLibsDir = join(srcTauriDir, "win-libs");
	await mkdir(winLibsDir, { recursive: true });

	// Rust's x86_64-pc-windows-gnu toolchain sometimes links `-l:libpthread.a`.
	// Some mingw-w64 toolchains provide `libpthread.a`, others provide `libwinpthread.a`.
	// On NixOS it is common to have `mcfgthread` instead of winpthreads.
	const gcc = await which("x86_64-w64-mingw32-gcc");
	if (!gcc) {
		throw new Error(
			"Missing `x86_64-w64-mingw32-gcc` in PATH. " +
				"On NixOS, enter the repo `nix-shell` first (needs mingw-w64 toolchain).",
		);
	}

	let libpthreadOrWinp: { path: string; kind: "pthread" | "winpthread" } | null =
		null;

	// 1) Ask gcc directly.
	{
		for (const [file, kind] of [
			["libpthread.a", "pthread"],
			["libwinpthread.a", "winpthread"],
		] as const) {
			const { stdout } = await sh(gcc, [`-print-file-name=${file}`]);
			const candidate = stdout.trim();
			if (candidate && candidate !== file && (await fileExists(candidate))) {
				libpthreadOrWinp = { path: candidate, kind };
				break;
			}
		}
	}

	// 2) Fallback: scan library search dirs.
	if (!libpthreadOrWinp) {
		const { stdout } = await sh(gcc, ["-print-search-dirs"]);
		const { libraries } = parseGccSearchDirs(stdout);
		for (const dir of libraries) {
			for (const [file, kind] of [
				["libpthread.a", "pthread"],
				["libwinpthread.a", "winpthread"],
			] as const) {
				const candidate = join(dir, file);
				if (await fileExists(candidate)) {
					libpthreadOrWinp = { path: candidate, kind };
					break;
				}
			}
			if (libpthreadOrWinp) break;
		}
	}

	// 3) NixOS fallback: use mcfgthread as pthread provider.
	// This is a pragmatic shim: it satisfies Rust's `-l:libpthread.a` and provides pthread_* symbols.
	if (!libpthreadOrWinp) {
		const { stdout } = await sh("bash", [
			"-lc",
			"ls -1 /nix/store/*mcfgthread*x86_64-w64-mingw32*/lib/libmcfgthread.a 2>/dev/null | head -n 1",
		]);
		const candidate = stdout.trim();
		if (candidate && (await fileExists(candidate))) {
			libpthreadOrWinp = { path: candidate, kind: "pthread" };
		}
	}

	// 4) Allow manual override.
	if (!libpthreadOrWinp) {
		const override =
			process.env.HARMONY_LIBPTHREAD_A ??
			process.env.HARMONY_LIBWINPTHREAD_A ??
			null;
		if (override && (await fileExists(override))) {
			libpthreadOrWinp = { path: override, kind: "pthread" };
		}
	}

	if (!libpthreadOrWinp) {
		throw new Error(
			"Unable to locate a pthread provider for x86_64-w64-mingw32. " +
				"Set `HARMONY_LIBPTHREAD_A=/abs/path/to/libpthread.a` (or `HARMONY_LIBWINPTHREAD_A=/abs/path/to/libwinpthread.a`).",
		);
	}

	const dest = join(winLibsDir, "libpthread.a");
	await copyFile(libpthreadOrWinp.path, dest);
}

async function main() {
	const clientRoot = projectRootFromClientCwd();
	const repoRoot = resolve(clientRoot, "..");
	const srcTauriDir = join(clientRoot, "src-tauri");
	const binDir = join(srcTauriDir, "bin");

	const triple = targetTripleFromTauriEnv() ?? (await rustHostTriple());
	const isWindowsTarget = triple.includes("windows");
	const ext = isWindowsTarget ? ".exe" : "";
	const outFile = join(binDir, `harmony-server-${triple}${ext}`);

	// Avoid stale binaries when switching toolchains/targets.
	await mkdir(binDir, { recursive: true });
	await rm(outFile, { force: true });

	const entry = join(repoRoot, "server", "src", "index.ts");
	console.info(`[tauri-prebuild] Building backend sidecar: ${outFile}`);
	const compileArgs = ["build", "--compile", "--outfile", outFile, entry];

	if (isWindowsTarget && process.platform !== "win32") {
		await ensureWindowsPthreadShim(srcTauriDir);

		// Bun can cross-compile when given a target-platform Bun executable "template".
		// Provide it via env var to keep this repo network-free and Nix-friendly.
		const bunWindowsExe =
			process.env.HARMONY_BUN_WINDOWS_EXE ?? process.env.BUN_WINDOWS_EXE ?? null;
		if (!bunWindowsExe) {
			throw new Error(
				"Missing `HARMONY_BUN_WINDOWS_EXE` (path to bun.exe for Windows). " +
					"Required to cross-compile backend sidecar for Windows on non-Windows hosts.",
			);
		}
		compileArgs.splice(2, 0, "--compile-executable-path", bunWindowsExe);
	}

	await sh("bun", compileArgs, {
		cwd: repoRoot,
	});
}

main().catch((err) => {
	console.error("[tauri-prebuild] Failed:", err);
	process.exit(1);
});
