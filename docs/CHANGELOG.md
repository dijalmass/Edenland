# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [Unreleased]
### Added
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
