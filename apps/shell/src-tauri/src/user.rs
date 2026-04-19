use std::process::Command;
use log::{error, info};

#[tauri::command]
pub fn system_poweroff() -> Result<(), String> {
    info!("Executando systemctl poweroff...");
    let output = Command::new("systemctl")
        .arg("poweroff")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let err = String::from_utf8_lossy(&output.stderr).to_string();
        error!("Erro ao desligar: {}", err);
        Err(err)
    }
}

#[tauri::command]
pub fn system_reboot() -> Result<(), String> {
    info!("Executando systemctl reboot...");
    let output = Command::new("systemctl")
        .arg("reboot")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let err = String::from_utf8_lossy(&output.stderr).to_string();
        error!("Erro ao reiniciar: {}", err);
        Err(err)
    }
}

#[tauri::command]
pub fn system_lock() -> Result<(), String> {
    info!("Executando loginctl lock-session...");
    let output = Command::new("loginctl")
        .arg("lock-session")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let err = String::from_utf8_lossy(&output.stderr).to_string();
        error!("Erro ao bloquear sessão: {}", err);
        Err(err)
    }
}

#[tauri::command]
pub fn system_logout() -> Result<(), String> {
    info!("Executando loginctl terminate-user...");
    
    // Pega o nome do usuário atual
    let user = std::env::var("USER").unwrap_or_else(|_| "root".to_string());
    
    let output = Command::new("loginctl")
        .arg("terminate-user")
        .arg(&user)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let err = String::from_utf8_lossy(&output.stderr).to_string();
        error!("Erro ao encerrar sessão: {}", err);
        Err(err)
    }
}

// Mock de comandos para o perfil (como sugerido)
#[tauri::command]
pub fn get_user_info() -> Result<serde_json::Value, String> {
    let username = std::env::var("USER").unwrap_or_else(|_| "Visitante".to_string());
    
    Ok(serde_json::json!({
        "username": username,
        "name": username, // Na vida real viria do GECOS
        "avatar": null    // Mock
    }))
}

#[tauri::command]
pub fn update_user_name(_new_name: String) -> Result<(), String> {
    // Mock
    std::thread::sleep(std::time::Duration::from_millis(500));
    Ok(())
}

#[tauri::command]
pub fn update_user_password(_old_password: String, _new_password: String) -> Result<(), String> {
    // Mock
    std::thread::sleep(std::time::Duration::from_millis(500));
    Ok(())
}

#[tauri::command]
pub fn update_user_avatar(_image_path: String) -> Result<(), String> {
    // Mock
    std::thread::sleep(std::time::Duration::from_millis(500));
    Ok(())
}
