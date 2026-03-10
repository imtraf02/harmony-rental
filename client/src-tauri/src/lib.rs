use std::{
    fs::OpenOptions,
    net::{SocketAddr, TcpStream},
    path::PathBuf,
    process::{Child, Command, Stdio},
    sync::Mutex,
    time::Duration,
};

use tauri::{AppHandle, Manager, State};
use tauri_plugin_log::{Target, TargetKind};

struct ServerProcess(Mutex<Option<Child>>);

struct BackendSpawn {
    child: Child,
    log_path: Option<PathBuf>,
}

fn server_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("..")
        .join("server")
}

fn server_uploads_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_local_data_dir()
        .map_err(|err| format!("failed to resolve app data dir: {err}"))?
        .join("uploads");
    std::fs::create_dir_all(&dir).map_err(|err| format!("failed to create uploads dir: {err}"))?;
    Ok(dir)
}

fn server_env_file(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_local_data_dir()
        .map_err(|err| format!("failed to resolve app data dir: {err}"))?;
    std::fs::create_dir_all(&dir).map_err(|err| format!("failed to create app data dir: {err}"))?;

    let env_file = dir.join(".env");
    if !env_file.exists() {
        let template = r#"# Harmony Wedding Rental (desktop)
#
# Configure your local database connection here.
# Example:
# DATABASE_URL="postgresql://harmony:password@localhost:5432/rental?schema=public"
"#;
        std::fs::write(&env_file, template)
            .map_err(|err| format!("failed to write env template: {err}"))?;
    }

    Ok(env_file)
}

fn tail_log(path: &PathBuf, max_lines: usize) -> Option<String> {
    let contents = std::fs::read_to_string(path).ok()?;
    let lines: Vec<&str> = contents.lines().collect();
    if lines.is_empty() {
        return None;
    }
    let start = lines.len().saturating_sub(max_lines);
    Some(lines[start..].join("\n"))
}

fn wait_for_server(child: &mut Child, log_path: Option<&PathBuf>) -> Result<(), String> {
    let addr: SocketAddr = "127.0.0.1:4000"
        .parse()
        .map_err(|err| format!("invalid backend address: {err}"))?;

    for i in 0..60 {
        match child.try_wait() {
            Ok(Some(status)) => {
                let mut msg =
                    format!("backend process exited prematurely with {status} (after {i} retries)");
                if let Some(path) = log_path {
                    if let Some(tail) = tail_log(path, 80) {
                        msg.push_str(&format!("\nbackend log tail ({path:?}):\n{tail}"));
                    } else {
                        msg.push_str(&format!("\nbackend log: {path:?}"));
                    }
                }
                return Err(msg);
            }
            Err(err) => {
                return Err(format!("failed to check backend process status: {err}"));
            }
            Ok(None) => {} // still running
        }

        if TcpStream::connect_timeout(&addr, Duration::from_millis(250)).is_ok() {
            return Ok(());
        }

        std::thread::sleep(Duration::from_millis(250));
    }

    Err("backend did not start on 127.0.0.1:4000 within 15 seconds".into())
}

/// Locate the bundled `server-bundle.js` in Tauri's resource directory.
fn find_server_bundle(app: &AppHandle) -> Result<PathBuf, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|err| format!("failed to resolve resource dir: {err}"))?;

    // The prebuild places it at `resources/server-bundle.js`, which Tauri copies
    // into the resource dir root.
    let candidates = [
        resource_dir.join("resources").join("server-bundle.js"),
        resource_dir.join("server-bundle.js"),
    ];

    for path in &candidates {
        if path.exists() {
            return Ok(path.clone());
        }
    }

    Err(format!(
        "could not locate server-bundle.js in resource dir ({resource_dir:?})"
    ))
}

/// Locate the `bun` sidecar executable in Tauri's resource directory.
fn find_bun_sidecar(app: &AppHandle) -> Result<PathBuf, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|err| format!("failed to resolve resource dir: {err}"))?;

    let base_name = "bun";
    let search_dirs = [resource_dir.join("bin"), resource_dir.clone()];

    let mut candidates: Vec<PathBuf> = Vec::new();
    for dir in search_dirs {
        let entries = match std::fs::read_dir(&dir) {
            Ok(entries) => entries,
            Err(_) => continue,
        };
        for entry in entries.flatten() {
            let path = entry.path();
            let file_name = path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or_default()
                .to_string();

            #[cfg(target_os = "windows")]
            let matches = (file_name.starts_with(&format!("{base_name}-"))
                && file_name.ends_with(".exe"))
                || file_name == format!("{base_name}.exe");
            #[cfg(not(target_os = "windows"))]
            let matches =
                file_name.starts_with(&format!("{base_name}-")) || file_name == base_name;

            if matches {
                candidates.push(path);
            }
        }
    }

    candidates.sort();
    candidates
        .into_iter()
        .next()
        .ok_or_else(|| "could not locate bun sidecar in resource dir".into())
}

fn start_backend(app: &AppHandle) -> Result<BackendSpawn, String> {
    // ── Dev mode: run directly from source ──
    if cfg!(debug_assertions) {
        let child = Command::new("bun")
            .arg("run")
            .arg("src/index.ts")
            .current_dir(server_dir())
            .env("PORT", "4000")
            .stdout(Stdio::null())
            .stderr(Stdio::inherit())
            .spawn()
            .map_err(|err| format!("failed to start backend (dev): {err}"))?;
        return Ok(BackendSpawn {
            child,
            log_path: None,
        });
    }

    // ── Production mode: bun sidecar + bundled JS ──
    let bun_exe = find_bun_sidecar(app)?;
    let server_bundle = find_server_bundle(app)?;
    let uploads_dir = server_uploads_dir(app)?;
    let env_file = server_env_file(app)?;

    let log_dir = app
        .path()
        .app_log_dir()
        .map_err(|err| format!("failed to resolve log dir: {err}"))?;
    std::fs::create_dir_all(&log_dir).map_err(|err| format!("failed to create log dir: {err}"))?;

    let backend_log_path = log_dir.join("backend.log");
    let backend_log = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&backend_log_path)
        .map_err(|err| format!("failed to open backend log file: {err}"))?;
    let backend_log_err = backend_log
        .try_clone()
        .map_err(|err| format!("failed to clone backend log handle: {err}"))?;

    log::info!(
        "starting backend: {:?} run {:?}",
        bun_exe,
        server_bundle
    );

    let child = Command::new(&bun_exe)
        .arg("run")
        .arg(&server_bundle)
        .env("PORT", "4000")
        .env("NODE_ENV", "production")
        .env("UPLOADS_DIR", uploads_dir)
        .env("ENV_FILE", env_file)
        .stdout(Stdio::from(backend_log))
        .stderr(Stdio::from(backend_log_err))
        .spawn()
        .map_err(|err| format!("failed to start backend (bun sidecar): {err}"))?;

    Ok(BackendSpawn {
        child,
        log_path: Some(backend_log_path),
    })
}

fn stop_backend(app: &AppHandle) {
    if let Some(state) = app.try_state::<ServerProcess>() {
        if let Some(mut child) = state.0.lock().expect("server mutex poisoned").take() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::LogDir {
                        file_name: Some("harmony".into()),
                    }),
                    Target::new(TargetKind::Webview),
                    #[cfg(debug_assertions)]
                    Target::new(TargetKind::Stdout),
                ])
                .level(if cfg!(debug_assertions) {
                    log::LevelFilter::Info
                } else {
                    log::LevelFilter::Warn
                })
                .build(),
        )
        .manage(ServerProcess(Mutex::new(None)))
        .setup(|app| {
            match start_backend(app.handle()) {
                Ok(mut backend) => {
                    if let Err(err) = wait_for_server(&mut backend.child, backend.log_path.as_ref())
                    {
                        log::error!("{err}");
                        let _ = backend.child.kill();
                        let _ = backend.child.wait();
                    } else {
                        let state: State<'_, ServerProcess> = app.state();
                        *state.0.lock().expect("server mutex poisoned") = Some(backend.child);
                    }
                }
                Err(err) => {
                    log::error!("{err}");
                }
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if matches!(event, tauri::WindowEvent::Destroyed) && window.label() == "main" {
                stop_backend(&window.app_handle());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
