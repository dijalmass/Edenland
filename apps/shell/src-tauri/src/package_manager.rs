use serde::{Deserialize, Serialize};
use std::process::{Command, Stdio, Child};
use std::io::{BufRead, BufReader};
use log::info;
use tauri::{Window, Emitter, State};
use std::sync::{Arc, Mutex};
use std::collections::HashSet;
use tokio::time::{sleep, Duration};

pub struct PackageManagerState {
    pub current_process: Arc<Mutex<Option<Child>>>,
}

impl Default for PackageManagerState {
    fn default() -> Self {
        Self {
            current_process: Arc::new(Mutex::new(None)),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Package {
    pub name: String,
    pub version: String,
    pub description: String,
    pub repository: String,
    pub is_installed: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PackageDetails {
    pub name: String,
    pub version: String,
    pub description: String,
    pub repository: String,
    pub is_installed: bool,
    pub dependencies: Vec<String>,
    pub size: String,
    pub download_size: String,
    pub url: String,
    pub maintainer: String,
    pub license: String,
    pub architecture: String,
    pub build_date: String,
    pub install_date: String,
    pub groups: Vec<String>,
}

fn check_command_exists(cmd: &str) -> bool {
    Command::new("which")
        .arg(cmd)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

#[tauri::command]
pub async fn search_packages(query: String) -> Result<Vec<Package>, String> {
    if query.trim().is_empty() {
        return Ok(vec![]);
    }

    let manager = if check_command_exists("yay") {
        "yay"
    } else {
        "pacman"
    };

    info!("Buscando pacotes com {}: {}", manager, query);

    let output = Command::new(manager)
        .arg("-Ss")
        .arg(&query)
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut packages = Vec::new();
    let mut current_package: Option<Package> = None;

    // Obter lista de pacotes instalados para verificação precisa
    let installed_output = Command::new("pacman")
        .arg("-Qq")
        .output()
        .unwrap_or_else(|_| std::process::Output { status: unsafe { std::mem::zeroed() }, stdout: Vec::new(), stderr: Vec::new() });
    
    let installed_set: HashSet<String> = String::from_utf8_lossy(&installed_output.stdout)
        .lines()
        .map(|l| l.trim().to_string())
        .collect();

    for line in stdout.lines() {
        if line.starts_with(' ') || line.starts_with('\t') {
            if let Some(mut pkg) = current_package.take() {
                pkg.description = line.trim().to_string();
                packages.push(pkg);
            }
        } else {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 2 {
                let repo_name: Vec<&str> = parts[0].split('/').collect();
                let (repo, name) = if repo_name.len() == 2 {
                    (repo_name[0], repo_name[1])
                } else {
                    ("aur", repo_name[0])
                };

                let version = parts[1];
                // Verificação dupla: pelo texto do pacman E pela lista oficial
                let is_installed = line.contains("[instalado]") || 
                                 line.contains("[installed]") || 
                                 installed_set.contains(name);

                current_package = Some(Package {
                    name: name.to_string(),
                    version: version.to_string(),
                    description: String::new(),
                    repository: repo.to_string(),
                    is_installed,
                });
            }
        }
    }

    let query_lower = query.to_lowercase();
    packages.sort_by(|a, b| {
        let a_name = a.name.to_lowercase();
        let b_name = b.name.to_lowercase();
        if a_name == query_lower && b_name != query_lower { return std::cmp::Ordering::Less; }
        if b_name == query_lower && a_name != query_lower { return std::cmp::Ordering::Greater; }
        let a_starts = a_name.starts_with(&query_lower);
        let b_starts = b_name.starts_with(&query_lower);
        if a_starts && !b_starts { return std::cmp::Ordering::Less; }
        if b_starts && !a_starts { return std::cmp::Ordering::Greater; }
        let a_index = a_name.find(&query_lower).unwrap_or(usize::MAX);
        let b_index = b_name.find(&query_lower).unwrap_or(usize::MAX);
        if a_index != b_index { return a_index.cmp(&b_index); }
        a_name.cmp(&b_name)
    });

    Ok(packages)
}

#[tauri::command]
pub async fn get_package_info(name: String) -> Result<PackageDetails, String> {
    let manager = if check_command_exists("yay") {
        "yay"
    } else {
        "pacman"
    };

    let output = Command::new(manager)
        .arg("-Si")
        .arg(&name)
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut version = String::new();
    let mut description = String::new();
    let mut repository = String::new();
    let mut size = String::new();
    let mut download_size = String::new();
    let mut url = String::new();
    let mut maintainer = String::new();
    let mut license = String::new();
    let mut architecture = String::new();
    let mut build_date = String::new();
    let mut install_date = String::new();
    let mut dependencies = Vec::new();
    let mut groups = Vec::new();

    for line in stdout.lines() {
        let parts: Vec<&str> = line.splitn(2, ':').collect();
        if parts.len() < 2 { continue; }
        
        let key = parts[0].trim();
        let val = parts[1].trim().to_string();

        match key {
            "Versão" | "Version" => version = val,
            "Descrição" | "Description" => description = val,
            "Repositório" | "Repository" => repository = val,
            "Tamanho instalado" | "Installed Size" => size = val,
            "Tamanho do download" | "Download Size" => download_size = val,
            "URL" => url = val,
            "Mantenedor" | "Maintainer" => maintainer = val,
            "Licenças" | "Licenses" => license = val,
            "Arquitetura" | "Architecture" => architecture = val,
            "Data da compilação" | "Build Date" => build_date = val,
            "Data da instalação" | "Install Date" => install_date = val,
            "Depende de" | "Depends On" => dependencies = val.split_whitespace().map(|s| s.to_string()).collect(),
            "Grupos" | "Groups" => groups = val.split_whitespace().map(|s| s.to_string()).collect(),
            _ => {}
        }
    }

    let is_installed = Command::new("pacman")
        .arg("-Qq")
        .arg(&name)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);

    Ok(PackageDetails {
        name,
        version,
        description,
        repository,
        is_installed,
        dependencies,
        size,
        download_size,
        url,
        maintainer,
        license,
        architecture,
        build_date,
        install_date,
        groups,
    })
}

#[tauri::command]
pub async fn execute_package_action(
    window: Window,
    state: State<'_, PackageManagerState>,
    action: String,
    name: String,
    password: String
) -> Result<(), String> {
    let manager = if check_command_exists("yay") { "yay" } else { "pacman" };

    // 1. Sudo warm-up
    let mut sudo_v = Command::new("sudo")
        .arg("-S")
        .arg("-v")
        .stdin(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    if let Some(mut stdin) = sudo_v.stdin.take() {
        use std::io::Write;
        let _ = stdin.write_all(format!("{}\n", password).as_bytes());
    }
    if !sudo_v.wait().map_err(|e| e.to_string())?.success() {
        return Err("Autenticação falhou".to_string());
    }

    let args = match action.as_str() {
        "install" => vec!["-S", "--noconfirm", &name],
        "remove" => vec!["-Rs", "--noconfirm", &name],
        _ => return Err("Ação inválida".to_string()),
    };

    let mut command = if manager == "yay" {
        let mut c = Command::new("yay");
        c.args(&args);
        c
    } else {
        let mut c = Command::new("sudo");
        c.arg(manager).args(&args);
        c
    };

    let mut child = command
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take().ok_or("Stdout fail")?;
    let stderr = child.stderr.take().ok_or("Stderr fail")?;

    let w1 = window.clone();
    std::thread::spawn(move || {
        let r = BufReader::new(stdout);
        for l in r.lines() { if let Ok(line) = l { let _ = w1.emit("package-manager-log", line); } }
    });

    let w2 = window.clone();
    std::thread::spawn(move || {
        let r = BufReader::new(stderr);
        for l in r.lines() { if let Ok(line) = l { let _ = w2.emit("package-manager-log", format!("ERR: {}", line)); } }
    });

    // Salvar o child no estado
    {
        let mut current = state.current_process.lock().unwrap();
        *current = Some(child);
    }

    // Loop de espera (polling) para permitir cancelamento via Mutex
    let final_status = loop {
        {
            let mut current = state.current_process.lock().unwrap();
            if let Some(ref mut c) = *current {
                match c.try_wait() {
                    Ok(Some(status)) => break status,
                    Ok(None) => {} // Ainda rodando
                    Err(e) => return Err(e.to_string()),
                }
            } else {
                // Se o processo sumiu do Mutex, significa que foi cancelado
                let _ = window.emit("package-manager-log", "🛑 Operação cancelada pelo usuário.".to_string());
                return Ok(());
            }
        }
        sleep(Duration::from_millis(200)).await;
    };

    // Limpar o estado ao finalizar
    {
        let mut current = state.current_process.lock().unwrap();
        *current = None;
    }

    if final_status.success() {
        let _ = window.emit("package-manager-log", format!("✅ {} concluído!", action));
        Ok(())
    } else {
        let _ = window.emit("package-manager-log", format!("❌ {} falhou.", action));
        Err("Falha na execução".to_string())
    }
}

#[tauri::command]
pub async fn cancel_package_action(state: State<'_, PackageManagerState>) -> Result<(), String> {
    let mut current = state.current_process.lock().unwrap();
    if let Some(mut child) = current.take() {
        info!("Cancelando processo de pacote...");
        let _ = child.kill();
        Ok(())
    } else {
        Err("Nenhum processo em execução para cancelar".to_string())
    }
}

#[tauri::command]
pub async fn open_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(url)
            .spawn()
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "linux"))]
    {
        let _ = url;
        Err("Não suportado neste OS".to_string())
    }
}

#[tauri::command]
pub async fn get_installed_packages() -> Result<Vec<Package>, String> {
    let output = Command::new("pacman")
        .arg("-Qei") // List explicitly installed packages with info
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut packages = Vec::new();
    let mut current_name = String::new();
    let mut current_version = String::new();
    let mut current_desc = String::new();

    for line in stdout.lines() {
        if line.is_empty() {
            if !current_name.is_empty() {
                packages.push(Package {
                    name: current_name.clone(),
                    version: current_version.clone(),
                    description: current_desc.clone(),
                    repository: "local".to_string(),
                    is_installed: true,
                });
                current_name.clear();
                current_version.clear();
                current_desc.clear();
            }
            continue;
        }

        let parts: Vec<&str> = line.splitn(2, ':').collect();
        if parts.len() < 2 { continue; }
        
        let key = parts[0].trim();
        let val = parts[1].trim().to_string();

        match key {
            "Nome" | "Name" => current_name = val,
            "Versão" | "Version" => current_version = val,
            "Descrição" | "Description" => current_desc = val,
            _ => {}
        }
    }

    // Push the last one
    if !current_name.is_empty() {
        packages.push(Package {
            name: current_name,
            version: current_version,
            description: current_desc,
            repository: "local".to_string(),
            is_installed: true,
        });
    }

    Ok(packages)
}
