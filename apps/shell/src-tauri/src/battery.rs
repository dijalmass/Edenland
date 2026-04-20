use serde::{Serialize, Deserialize};
use std::fs;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct BatteryStatus {
    pub percentage: u8,
    pub status: String, // "Charging", "Discharging", "Full", etc.
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PowerProfile {
    pub name: String,
    pub active: bool,
}

#[tauri::command]
pub fn get_battery_status() -> Result<BatteryStatus, String> {
    let power_supply_dir = "/sys/class/power_supply";
    let entries = fs::read_dir(power_supply_dir).map_err(|e| format!("Failed to read power supply dir: {}", e))?;

    let mut battery_dev = None;
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with("BAT") {
            battery_dev = Some(name);
            break;
        }
    }

    let dev = battery_dev.ok_or_else(|| "No battery device found".to_string())?;
    let capacity_path = format!("{}/{}/capacity", power_supply_dir, dev);
    let status_path = format!("{}/{}/status", power_supply_dir, dev);

    let percentage = fs::read_to_string(capacity_path)
        .map_err(|e| format!("Failed to read battery capacity: {}", e))?
        .trim()
        .parse::<u8>()
        .map_err(|e| format!("Failed to parse battery capacity: {}", e))?;

    let status = fs::read_to_string(status_path)
        .map_err(|e| format!("Failed to read battery status: {}", e))?
        .trim()
        .to_string();

    Ok(BatteryStatus { percentage, status })
}

#[tauri::command]
pub fn get_power_profiles() -> Result<Vec<PowerProfile>, String> {
    let output = Command::new("powerprofilesctl")
        .arg("list")
        .output()
        .map_err(|e| format!("Failed to execute powerprofilesctl: {}", e))?;

    if !output.status.success() {
        return Err("powerprofilesctl list failed".to_string());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut profiles = Vec::new();

    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() { continue; }

        if trimmed.ends_with(':') {
            let name = trimmed.trim_end_matches(':').to_string();
            let active = line.starts_with('*');
            profiles.push(PowerProfile { name, active });
        }
    }

    Ok(profiles)
}

#[tauri::command]
pub fn set_power_profile(profile: String) -> Result<(), String> {
    let output = Command::new("powerprofilesctl")
        .arg("set")
        .arg(profile)
        .output()
        .map_err(|e| format!("Failed to execute powerprofilesctl: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("powerprofilesctl set failed: {}", stderr));
    }

    Ok(())
}
