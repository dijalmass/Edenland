mod network;
mod battery;
mod user;
mod audio;
mod display;

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
      battery::set_power_profile,
      user::system_poweroff,
      user::system_reboot,
      user::system_lock,
      user::system_logout,
      user::get_user_info,
      user::update_user_name,
      user::update_user_password,
      user::update_user_avatar,
      audio::get_audio_status,
      audio::get_output_devices,
      audio::get_app_volumes,
      audio::set_master_volume,
      audio::set_master_mute,
      audio::set_default_sink,
      audio::set_app_volume,
      display::get_brightness,
      display::set_brightness,
      display::get_monitors,
      display::get_workspaces,
      display::apply_monitor_config,
      display::set_workspace_monitor
    ])
    .setup(|_app| {
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
