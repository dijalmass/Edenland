use serde::{Serialize, Deserialize};
use std::process::Command;
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AudioStatus {
    pub volume: u32,
    pub mute: bool,
    pub default_sink: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AudioSink {
    pub index: u32,
    pub name: String,
    pub description: String,
    pub volume: u32,
    pub mute: bool,
    pub is_default: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AudioApp {
    pub index: u32,
    pub name: String,
    pub volume: u32,
    pub mute: bool,
}

fn parse_volume_percent(volume_obj: &Value) -> u32 {
    // pactl volume is a map of channels: {"front-left": {"value_percent": "50%"}, ...}
    if let Some(map) = volume_obj.as_object() {
        if let Some(first_channel) = map.values().next() {
            if let Some(percent_str) = first_channel.get("value_percent") {
                if let Some(s) = percent_str.as_str() {
                    return s.trim_end_matches('%').parse::<u32>().unwrap_or(0);
                }
            }
        }
    }
    0
}

#[tauri::command]
pub fn get_audio_status() -> Result<AudioStatus, String> {
    let output = Command::new("pactl")
        .args(["-f", "json", "info"])
        .output()
        .map_err(|e| format!("Failed to execute pactl info: {}", e))?;

    let info: Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Failed to parse pactl info: {}", e))?;

    let default_sink = info.get("default_sink_name")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "Could not find default sink".to_string())?
        .to_string();

    // Now get volume of default sink
    let sinks_output = Command::new("pactl")
        .args(["-f", "json", "list", "sinks"])
        .output()
        .map_err(|e| format!("Failed to execute pactl list sinks: {}", e))?;

    let sinks: Value = serde_json::from_slice(&sinks_output.stdout)
        .map_err(|e| format!("Failed to parse pactl sinks: {}", e))?;

    if let Some(sinks_array) = sinks.as_array() {
        for sink in sinks_array {
            if sink.get("name").and_then(|n| n.as_str()) == Some(&default_sink) {
                let volume = parse_volume_percent(sink.get("volume").unwrap_or(&Value::Null));
                let mute = sink.get("mute").and_then(|m| m.as_bool()).unwrap_or(false);
                return Ok(AudioStatus {
                    volume,
                    mute,
                    default_sink,
                });
            }
        }
    }

    Err("Default sink not found in list".to_string())
}

#[tauri::command]
pub fn get_output_devices() -> Result<Vec<AudioSink>, String> {
    let info_output = Command::new("pactl")
        .args(["-f", "json", "info"])
        .output()
        .map_err(|e| format!("Failed to execute pactl info: {}", e))?;
    
    let info: Value = serde_json::from_slice(&info_output.stdout).unwrap_or(Value::Null);
    let default_sink_name = info.get("default_sink_name").and_then(|v| v.as_str()).unwrap_or("");

    let output = Command::new("pactl")
        .args(["-f", "json", "list", "sinks"])
        .output()
        .map_err(|e| format!("Failed to execute pactl list sinks: {}", e))?;

    let sinks_json: Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Failed to parse pactl sinks: {}", e))?;

    let mut devices = Vec::new();

    if let Some(sinks) = sinks_json.as_array() {
        for sink in sinks {
            let name = sink.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let description = sink.get("description").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let index = sink.get("index").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let mute = sink.get("mute").and_then(|v| v.as_bool()).unwrap_or(false);
            let volume = parse_volume_percent(sink.get("volume").unwrap_or(&Value::Null));
            let is_default = name == default_sink_name;

            devices.push(AudioSink {
                index,
                name,
                description,
                volume,
                mute,
                is_default,
            });
        }
    }

    Ok(devices)
}

#[tauri::command]
pub fn get_app_volumes() -> Result<Vec<AudioApp>, String> {
    let output = Command::new("pactl")
        .args(["-f", "json", "list", "sink-inputs"])
        .output()
        .map_err(|e| format!("Failed to execute pactl list sink-inputs: {}", e))?;

    let apps_json: Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Failed to parse pactl sink-inputs: {}", e))?;

    let mut apps = Vec::new();

    if let Some(apps_array) = apps_json.as_array() {
        for app in apps_array {
            let index = app.get("index").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let volume = parse_volume_percent(app.get("volume").unwrap_or(&Value::Null));
            let mute = app.get("mute").and_then(|v| v.as_bool()).unwrap_or(false);
            
            // App name is usually in properties.application.name or media.name
            let name = app.get("properties")
                .and_then(|p| p.get("application.name"))
                .and_then(|v| v.as_str())
                .or_else(|| app.get("properties").and_then(|p| p.get("media.name")).and_then(|v| v.as_str()))
                .unwrap_or("Unknown App")
                .to_string();

            apps.push(AudioApp {
                index,
                name,
                volume,
                mute,
            });
        }
    }

    Ok(apps)
}

#[tauri::command]
pub fn set_master_volume(volume: u32) -> Result<(), String> {
    let volume_str = format!("{}%", volume);
    let output = Command::new("pactl")
        .args(["set-sink-volume", "@DEFAULT_SINK@", &volume_str])
        .output()
        .map_err(|e| format!("Failed to set volume: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(())
}

#[tauri::command]
pub fn set_master_mute(mute: bool) -> Result<(), String> {
    let mute_str = if mute { "1" } else { "0" };
    let output = Command::new("pactl")
        .args(["set-sink-mute", "@DEFAULT_SINK@", mute_str])
        .output()
        .map_err(|e| format!("Failed to set mute: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(())
}

#[tauri::command]
pub fn set_default_sink(name: String) -> Result<(), String> {
    let output = Command::new("pactl")
        .args(["set-default-sink", &name])
        .output()
        .map_err(|e| format!("Failed to set default sink: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(())
}

#[tauri::command]
pub fn set_app_volume(index: u32, volume: u32) -> Result<(), String> {
    let volume_str = format!("{}%", volume);
    let output = Command::new("pactl")
        .args(["set-sink-input-volume", &index.to_string(), &volume_str])
        .output()
        .map_err(|e| format!("Failed to set app volume: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(())
}
