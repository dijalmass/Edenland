use tokio::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkInfo {
    ssid: String,
    strength: u8,
    secured: bool,
    connected: bool,
}

#[tauri::command]
pub async fn get_wifi_status() -> Result<bool, String> {
    let output = Command::new("nmcli")
        .args(["radio", "wifi"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(if err.is_empty() { "NetworkManager not responding".to_string() } else { err });
    }

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_lowercase();
    Ok(stdout == "enabled")
}

#[tauri::command]
pub async fn toggle_wifi(enable: bool) -> Result<(), String> {
    let action = if enable { "on" } else { "off" };
    let output = Command::new("nmcli")
        .args(["radio", "wifi", action])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
        Err(if err.is_empty() { format!("Failed to turn WiFi {}", action) } else { err })
    }
}

#[tauri::command]
pub async fn scan_wifi_networks() -> Result<Vec<NetworkInfo>, String> {
    // nmcli -t -f IN-USE,SSID,SIGNAL,SECURITY dev wifi list
    let output = Command::new("nmcli")
        .args(["-t", "-f", "IN-USE,SSID,SIGNAL,SECURITY", "dev", "wifi", "list"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(if err.is_empty() { "Failed to execute nmcli command".to_string() } else { err });
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut networks = Vec::new();

    for line in stdout.lines() {
        if line.is_empty() {
            continue;
        }

        let parts: Vec<&str> = line.split(':').collect();
        if parts.len() >= 4 {
            let connected = parts[0] == "*";
            let ssid = parts[1].to_string();
            
            if ssid.is_empty() || ssid == "--" {
                continue;
            }

            let strength = parts[2].parse::<u8>().unwrap_or(0);
            
            let sec_str = parts[3].trim();
            let secured = !sec_str.is_empty() && sec_str != "--";

            networks.push(NetworkInfo {
                ssid,
                strength,
                secured,
                connected,
            });
        }
    }

    // Sort by connected first, then by strength
    networks.sort_by(|a, b| {
        b.connected.cmp(&a.connected)
            .then(b.strength.cmp(&a.strength))
    });

    // Remove duplicates
    networks.dedup_by(|a, b| a.ssid == b.ssid);

    Ok(networks)
}

#[tauri::command]
pub async fn connect_to_wifi(ssid: String, password: Option<String>) -> Result<(), String> {
    let mut cmd = Command::new("nmcli");
    
    if let Some(pass) = password {
        if !pass.is_empty() {
            cmd.args(["--wait", "20", "dev", "wifi", "connect", &ssid, "password", &pass]);
        } else {
            cmd.args(["--wait", "20", "dev", "wifi", "connect", &ssid]);
        }
    } else {
        // Tenta 'connection up' primeiro para casos onde já existe uma conexão configurada
        let output = Command::new("nmcli")
            .args(["--wait", "20", "connection", "up", "id", &ssid])
            .output()
            .await
            .map_err(|e| e.to_string())?;
        
        if output.status.success() {
            return Ok(());
        }
        
        cmd.args(["--wait", "20", "dev", "wifi", "connect", &ssid]);
    }

    let output = cmd.output().await.map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let err_msg = String::from_utf8_lossy(&output.stderr).trim().to_string();
        let out_msg = String::from_utf8_lossy(&output.stdout).trim().to_string();
        
        let combined = if !err_msg.is_empty() {
            err_msg
        } else if !out_msg.is_empty() {
            out_msg
        } else {
            "Unknown connection error".to_string()
        };
        
        Err(combined)
    }
}

#[tauri::command]
pub async fn disconnect_from_wifi() -> Result<(), String> {
    // Encontra a interface wifi conectada
    let output = Command::new("nmcli")
        .args(["-t", "-f", "DEVICE,TYPE,STATE", "dev"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut interface = None;

    for line in stdout.lines() {
        let parts: Vec<&str> = line.split(':').collect();
        if parts.len() >= 3 && parts[1] == "wifi" && parts[2] == "connected" {
            interface = Some(parts[0].to_string());
            break;
        }
    }

    if let Some(iface) = interface {
        let output = Command::new("nmcli")
            .args(["dev", "disconnect", &iface])
            .output()
            .await
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
            Err(if err.is_empty() { "Failed to disconnect".to_string() } else { err })
        }
    } else {
        Err("No active Wi-Fi connection found to disconnect".to_string())
    }
}
