# Workspace Switcher

Implementação de um seletor de áreas de trabalho (workspaces) no header da shell, permitindo alternância rápida e visualização de conteúdo através de previews.

## Funcionalidades

- **Indicadores Numéricos**: Exibe os workspaces ativos no canto superior esquerdo.
- **Criação Dinâmica**: Mostra automaticamente o próximo workspace disponível (até o limite de 9) se o último estiver em uso.
- **Preview ao Passar o Mouse**: Ao pairar sobre um número por 400ms, um popover exibe a lista de janelas abertas naquele workspace.
- **Integração com Hyprland**: Utiliza `hyprctl` para buscar dados em tempo real e executar a troca de área de trabalho.
- **Header Unificado**: O header agora abriga tanto o Workspace Switcher quanto o DateTime Manager, proporcionando uma interface de topo limpa e profissional.

## Componentes

- `WorkspaceSwitcher`: Componente principal com lógica de listagem e popover.
- `Header`: Barra horizontal fixa no topo da tela.
- `useWorkspaceSwitcher`: Hook customizado para gerenciar o estado dos workspaces via Tauri.

## Comandos Tauri

- `get_workspaces`: Retorna lista de workspaces ativos.
- `get_active_workspace`: Identifica o workspace focado.
- `get_workspace_clients`: Lista janelas de um workspace específico.
- `switch_workspace`: Executa a mudança de workspace.

## Estilo Visual

- **Glassmorphism**: Fundo semi-transparente com desfoque (blur) e bordas sutis.
- **Destaque (Glory Gold)**: O workspace ativo é destacado com a cor primária do sistema e um brilho suave.
- **Animações**: Transições suaves de escala e opacidade via Framer Motion.
