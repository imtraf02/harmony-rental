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

fn wait_for_server() -> Result<(), String> {
    let addr: SocketAddr = "127.0.0.1:4000"
        .parse()
        .map_err(|err| format!("invalid backend address: {err}"))?;

    for _ in 0..40 {
        if TcpStream::connect_timeout(&addr, Duration::from_millis(250)).is_ok() {
            return Ok(());
        }

        std::thread::sleep(Duration::from_millis(250));
    }

    Err("backend did not start on 127.0.0.1:4000".into())
}

fn find_sidecar_executable(app: &AppHandle) -> Result<PathBuf, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|err| format!("failed to resolve resource dir: {err}"))?;

    let base_name = "harmony-server";
    let search_dirs = [resource_dir.join("bin"), resource_dir];

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
            let matches = file_name.starts_with(&format!("{base_name}-")) && file_name.ends_with(".exe");
            #[cfg(not(target_os = "windows"))]
            let matches = file_name.starts_with(&format!("{base_name}-"));

            if matches || file_name == base_name {
                candidates.push(path);
            }
        }
    }

    candidates.sort();
    candidates
        .into_iter()
        .next()
        .ok_or_else(|| "could not locate bundled backend sidecar in resource dir".into())
}

fn start_backend(app: &AppHandle) -> Result<Child, String> {
    if cfg!(debug_assertions) {
        return Command::new("bun")
            .arg("run")
            .arg("src/index.ts")
            .current_dir(server_dir())
            .env("PORT", "4000")
            .stdout(Stdio::null())
            .stderr(Stdio::inherit())
            .spawn()
            .map_err(|err| format!("failed to start backend (dev): {err}"));
    }

    let sidecar = find_sidecar_executable(app)?;
    let uploads_dir = server_uploads_dir(app)?;
    let env_file = server_env_file(app)?;

    let log_dir = app
        .path()
        .app_log_dir()
        .map_err(|err| format!("failed to resolve log dir: {err}"))?;
    std::fs::create_dir_all(&log_dir).map_err(|err| format!("failed to create log dir: {err}"))?;
    let backend_log = OpenOptions::new()
        .create(true)
        .append(true)
        .open(log_dir.join("backend.log"))
        .map_err(|err| format!("failed to open backend log file: {err}"))?;

    Command::new(sidecar)
        .env("PORT", "4000")
        .env("NODE_ENV", "production")
        .env("UPLOADS_DIR", uploads_dir)
        .env("ENV_FILE", env_file)
        .stdout(Stdio::null())
        .stderr(Stdio::from(backend_log))
        .spawn()
        .map_err(|err| format!("failed to start backend (sidecar): {err}"))
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
                Ok(child) => {
                    {
                        let state: State<'_, ServerProcess> = app.state();
                        *state.0.lock().expect("server mutex poisoned") = Some(child);
                    }

                    if let Err(err) = wait_for_server() {
                        log::error!("{err}");
                        stop_backend(app.handle());
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
