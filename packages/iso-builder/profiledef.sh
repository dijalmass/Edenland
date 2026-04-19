#!/usr/bin/env bash
# shellcheck disable=SC2034

iso_name="edenland"
iso_label="EDENLAND_$(date +%Y%m)"
iso_publisher="Edenland Project <https://github.com/dijalmass/Edenland>"
iso_application="Edenland Live/Installation System"
iso_version="$(date +%Y.%m.%d)"
install_dir="edenland"
buildmodes=('iso')
bootmodes=('bios.syslinux.mbr' 'bios.syslinux.eltorito' 'uefi-ia32.grub.esp' 'uefi-x64.grub.esp' 'uefi-ia32.grub.eltorito' 'uefi-x64.grub.eltorito')
arch="x86_64"
pacman_conf="pacman.conf"
airootfs_image_type="squashfs"
airootfs_image_tool_options=('-comp' 'xz' '-Xbcj' 'x86')
file_permissions=(
  ["/etc/shadow"]="0:0:400"
  ["/root"]="0:0:750"
  ["/usr/local/bin/choose-mirror"]="0:0:755"
  ["/usr/local/bin/Installation_Guide"]="0:0:755"
  ["/usr/local/bin/livecd-sound"]="0:0:755"
  ["/etc/greetd/config.toml"]="0:0:644"
  ["/etc/edenland/hyprland.conf"]="0:0:644"
  ["/etc/edenland/hyprpaper.conf"]="0:0:644"
  ["/usr/bin/edenland-shell"]="0:0:755"
  ["/home/archuser/install.sh"]="1000:1000:755"
)
