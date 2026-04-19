# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [Planejado]

### Aplicativos Nativos
- **Terminal Edenland**: Desenvolvimento de um emulador de terminal nativo (construído do zero ou usando uma base xterm.js adaptada e super estilizada) integrando completamente a identidade visual e experiência premium do projeto.


### Core & Shell
- **Shell UX Refinement**: Transição do Shell de uma janela comum para uma interface de sistema nativa (sem header/decorações) e modo tela cheia.
- **Theme Engine**: Sistema de personalização dinâmica que permite alterar tanto a cor de destaque (accent) quanto a cor base (primária) do sistema, com derivação automática de tons.
- **Hyprland Compatibility**: Atualização das regras de janela para a nova sintaxe unificada `windowrule` e desativação de processos redundantes de wallpaper.
- **System Theme**: Refinamento da transparência e integração visual entre o compositor e o shell.
- **System Tray**: Área designada no Dock para abrigar ícones e interações de aplicações em segundo plano.
- **Central de Notificações**: Painel unificado para histórico de alertas, expandindo as notificações já existentes.

### Hardware & Gestão de Sistema
- **Bluetooth Manager**: Integração com `bluetoothctl` para permitir varredura e pareamento simplificado de dispositivos sem fio.

## [Unreleased]
### Fixed
- **Audio Manager**: Removido botão incorreto de "Configurações de Rede" que aparecia no modal de áudio.
- **ISO Builder**: Corrigido o nome do pacote `powerprofilesctl` para `power-profiles-daemon` na lista de pacotes.
- **ISO Builder**: Corrigido erro 404 ao tentar sincronizar o repositório `community` (descontinuado e fundido ao `extra`) e otimizado `pacman.conf` com `ParallelDownloads` e feedback visual.
- **ISO Builder**: Corrigido erro "Failed to start Switch Root" adicionando `mkinitcpio-archiso` e configurando os hooks corretos no `mkinitcpio.conf` da ISO.
- **ISO Builder**: Corrigido erro `Hook 'archiso_shutdown' cannot be found` removendo o hook obsoleto do `mkinitcpio.conf`.
- **ISO Builder**: Corrigida a sintaxe do `hyprland.conf` (shadow e window rules) para evitar erros de configuração no boot.
- **ISO Builder**: Adicionado pacote `pv` para evitar avisos no log e fornecer feedback visual de progresso.
- **ISO Builder**: Adicionado suporte a VMs com os pacotes `qemu-guest-agent` e `spice-vdagent`.

- **Shell**: Correção do erro de build de produção (`com.tauri.dev` identifier) permitindo a geração da ISO.
- **ISO Builder**: Corrigido travamento de TTY durante o build causado pelo prompt do `sudo` dentro do Turborepo; atualizados modos de boot depreciados, restauradas pastas de configuração (`grub`/`syslinux`), limpas permissões de arquivos inexistentes no `profiledef.sh` e atualizado o README com instruções de build Local vs CI/CD.
- **ISO Builder**: Corrigido falha no carregamento da interface gráfica adicionando drivers (`mesa`), suporte a fontes (`noto-fonts`) e movendo o `greetd` para a VT7 para evitar conflitos.
- **ISO Builder**: Corrigido erro de detecção automática de SO no QEMU/Virt-manager através da criação de um arquivo `os-release` customizado com ID Arch.


### Added
- **Edenland Installer**: Script `install.sh` automatizado que gerencia dependências, sessão Wayland e atualização via GitHub API.
- **ISO Builder**: Estrutura baseada em Archiso para geração de imagens live com autologin e shell pré-configurado.
- **Window Management**: Integração oficial com o compositor **Hyprland** e configuração de dotfiles customizados (`packages/configs`).
- **Wallpaper Manager**: Implementação do `hyprpaper` com wallpaper premium "Árvore da Vida" integrado ao sistema e ao frontend para visualização.
- **Login Manager**: Configuração do `greetd` e `tuigreet` para uma experiência de login minimalista e moderna.
- **User Manager**: Implementação do gerenciador de sessão (logout, lock, restart, shutdown) via `loginctl` e modal de perfil de usuário com badge em desenvolvimento (mock).
- **Shell**: Transição do header horizontal para um dock vertical lateral direito.
- **DateTime Manager**: Novo componente para exibição de data e hora com calendário, e painel de configurações para formatar a visualização.
- **Core**: Inicialização do Monorepo utilizando Bun e Turborepo.
- **Shell**: Estrutura base da aplicação shell com Tauri v2 e React.
- **Network Manager**: Integração completa com o `NetworkManager` Linux.
  - Listagem de redes Wi-Fi em tempo real.
  - Conexão e desconexão de redes (com suporte a senhas).
  - Feedback visual via notificações `Sonner`.
  - Internacionalização (i18n) configurada e aplicada.
- **Battery Manager**: Integração completa para gestão de energia.
  - Indicador de bateria dinâmico e status de carregamento.
  - Toggle para exibir/ocultar porcentagem na barra superior.
  - Modal para seleção de planos de energia (via `powerprofilesctl`).
  - Persistência de preferências em `localStorage`.
- **Audio Manager**: Integração completa para gestão de som.
  - Controle de volume mestre e mudo com feedback visual no Dock.
  - Seleção dinâmica de dispositivos de saída (Sinks).
  - Controle de volume individual por aplicação (Sink Inputs).
  - Design premium glassmorphism integrado à identidade visual.
- **Display Manager**: Gerenciamento de brilho, monitores (canvas) e temas de cores (Em andamento).
