# ISO Builder Implementation

O pacote `iso-builder` é responsável por gerar a imagem ISO oficial do Edenland baseada no Arch Linux.

## Estrutura da ISO

- **Base:** Arch Linux (usando `mkarchiso`).
- **Desktop Environment:** Hyprland (Wayland).
- **Login Manager:** `greetd` com login automático para `archuser`.
- **Shell:** Edenland Shell (incluído em `/usr/bin/edenland`).

## Configurações Relevantes

### mkinitcpio
O arquivo `airootfs/etc/mkinitcpio.conf` foi configurado para suportar o ambiente live:
- **HOOKS:** `base udev memdisk archiso archiso_loop_mnt block filesystems keyboard`.
- **Compressão:** `xz` para menor tamanho de imagem.

### Pacotes Adicionais
Além da base do Arch, incluímos:
- `pv`: Para monitoramento de progresso durante o build.
- `qemu-guest-agent` & `spice-vdagent`: Suporte aprimorado para máquinas virtuais.
- `hyprland` & `xorg-xwayland`: Base gráfica.
- `noto-fonts` & `noto-fonts-emoji`: Tipografia moderna.

## Procedimento de Build
Para gerar a ISO, execute o script no root do projeto:
```bash
npm run build:iso
```
Isso utilizará o `mkarchiso` para processar o diretório atual e gerar a imagem em `out/`.
