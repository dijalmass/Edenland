# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [Planejado]

### Aplicativos Nativos
- **Terminal Edenland**: Desenvolvimento de um emulador de terminal nativo (construído do zero ou usando uma base xterm.js adaptada e super estilizada) integrando completamente a identidade visual e experiência premium do projeto.


### Core & Shell
- **Command Palette / Application Launcher**: O verdadeiro coração "Command-First" do sistema (estilo Spotlight/KRunner) para executar apps, buscar arquivos e rodar scripts.
- **System Tray**: Área designada no Dock para abrigar ícones e interações de aplicações em segundo plano.
- **Central de Notificações**: Painel unificado para histórico de alertas, expandindo as notificações já existentes.

### Hardware & Gestão de Sistema
- **Audio / Volume Manager**: Gestão completa de áudio, englobando controle de saídas, entradas e volume geral via PipeWire/PulseAudio.
- **Display / Brightness Manager**: Interface gráfica e atalhos para controle nativo do brilho da tela e arranjo de monitores.
- **Bluetooth Manager**: Integração com `bluetoothctl` para permitir varredura e pareamento simplificado de dispositivos sem fio.

## [Unreleased]
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
