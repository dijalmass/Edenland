use std::process::Command;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Monitor {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub width: i32,
    pub height: i32,
    pub refresh_rate: f32,
    pub x: i32,
    pub y: i32,
    pub scale: f32,
    pub focused: bool,
    pub disabled: bool,
    #[serde(default)]
    pub available_modes: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Workspace {
    pub id: i32,
    pub name: String,
    pub monitor: String,
    pub windows: i32,
    pub lastwindowtitle: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Client {
    pub address: String,
    pub workspace: WorkspaceRef,
    pub class: String,
    pub title: String,
    pub pid: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceRef {
    pub id: i32,
    pub name: String,
}

#[tauri::command]
pub fn get_brightness() -> Result<i32, String> {
    let output = Command::new("brightnessctl")
        .arg("g")
        .output()
        .map_err(|e| e.to_string())?;
    
    let current = String::from_utf8_lossy(&output.stdout)
        .trim()
        .parse::<i32>()
        .map_err(|e| e.to_string())?;

    let max_output = Command::new("brightnessctl")
        .arg("m")
        .output()
        .map_err(|e| e.to_string())?;
    
    let max = String::from_utf8_lossy(&max_output.stdout)
        .trim()
        .parse::<i32>()
        .map_err(|e| e.to_string())?;

    if max == 0 { return Ok(0); }
    
    Ok((current * 100) / max)
}

#[tauri::command]
pub fn set_brightness(percentage: i32) -> Result<(), String> {
    Command::new("brightnessctl")
        .arg("s")
        .arg(format!("{}%", percentage))
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn get_monitors() -> Result<Vec<Monitor>, String> {
    let output = Command::new("hyprctl")
        .args(["monitors", "-j"])
        .output()
        .map_err(|e| e.to_string())?;
    
    let monitors: Vec<Monitor> = serde_json::from_slice(&output.stdout)
        .map_err(|e| {
            println!("Failed to parse monitors: {}", e);
            e.to_string()
        })?;
    
    Ok(monitors)
}

#[tauri::command]
pub fn get_workspaces() -> Result<Vec<Workspace>, String> {
    let output = Command::new("hyprctl")
        .args(["workspaces", "-j"])
        .output()
        .map_err(|e| e.to_string())?;
    
    let workspaces: Vec<Workspace> = serde_json::from_slice(&output.stdout)
        .map_err(|e| e.to_string())?;
    
    Ok(workspaces)
}

#[tauri::command]
pub fn get_active_workspace() -> Result<Workspace, String> {
    let output = Command::new("hyprctl")
        .args(["activeworkspace", "-j"])
        .output()
        .map_err(|e| e.to_string())?;
    
    let workspace: Workspace = serde_json::from_slice(&output.stdout)
        .map_err(|e| e.to_string())?;
    
    Ok(workspace)
}

#[tauri::command]
pub fn get_workspace_clients(workspace_id: i32) -> Result<Vec<Client>, String> {
    let output = Command::new("hyprctl")
        .args(["clients", "-j"])
        .output()
        .map_err(|e| e.to_string())?;
    
    let all_clients: Vec<Client> = serde_json::from_slice(&output.stdout)
        .map_err(|e| e.to_string())?;
    
    let filtered: Vec<Client> = all_clients
        .into_iter()
        .filter(|c| c.workspace.id == workspace_id)
        .collect();
    
    Ok(filtered)
}

#[tauri::command]
pub fn switch_workspace(id: i32) -> Result<(), String> {
    Command::new("hyprctl")
        .args(["dispatch", "workspace", &id.to_string()])
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn apply_monitor_config(name: String, res: String, pos: String, scale: String) -> Result<(), String> {
    let config = format!("{},{},{},{}", name, res, pos, scale);
    
    Command::new("hyprctl")
        .args(["keyword", "monitor", &config])
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn set_workspace_monitor(workspace_id: i32, monitor_name: String) -> Result<(), String> {
    Command::new("hyprctl")
        .args(["keyword", "workspace", &format!("{},monitor:{}", workspace_id, monitor_name)])
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
#[tauri::command]
pub fn focus_window(address: String) -> Result<(), String> {
    Command::new("hyprctl")
        .args(["dispatch", "focuswindow", &format!("address:{}", address)])
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
