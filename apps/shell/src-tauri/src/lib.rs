mod network;
mod battery;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())
    .invoke_handler(tauri::generate_handler![
      network::get_wifi_status,
      network::toggle_wifi,
      network::scan_wifi_networks,
      network::connect_to_wifi,
      network::disconnect_from_wifi,
      battery::get_battery_status,
      battery::get_power_profiles,
      battery::set_power_profile
    ])
    .setup(|_app| {
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
