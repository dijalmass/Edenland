# User Manager Implementation

## Objetivo
Implementar um componente `UserManager` no dock do shell do Edenland que fornece uma interface unificada para:
1. Operações de Energia do Sistema (Logout, Lock, Restart, Shutdown) utilizando comandos nativos do `loginctl` e `systemctl` (priorizando arch linux nativo).
2. Configurações de Perfil de Usuário (Alterar Imagem, Nome e Senha) - Atualmente com uma badge indicando que está em desenvolvimento (mockado).

## Estrutura Técnica

### Frontend (React + Tauri)
O componente segue a arquitetura atômica padrão do projeto:
- `UserManager.component.tsx`: Componente principal utilizando `framer-motion` para animações fluidas do modal e tabs embutidas.
- `UserManager.hook.ts`: Gerencia o estado local (tabs, visibilidade do modal) e a comunicação com o backend Tauri.
- `UserManager.types.ts`: Define as interfaces das estruturas de dados e comandos de energia.
- `index.ts`: Exporta o componente para uso no Dock.

O UI incorpora ícones de `lucide-react` e se alinha com o design premium (blur, bordas translúcidas) dos demais managers (Battery, Network, DateTime).

### Backend (Rust)
Criado o módulo `user.rs` dentro de `apps/shell/src-tauri/src` contendo:
- `system_poweroff`: Invoca `systemctl poweroff`
- `system_reboot`: Invoca `systemctl reboot`
- `system_lock`: Invoca `loginctl lock-session`
- `system_logout`: Invoca `loginctl terminate-user $USER`
- Funções de edição de perfil marcadas como mock por enquanto.

## Internacionalização (i18n)
O componente utiliza o namespace comum de traduções, com chaves adicionadas para as labels de energia e perfil, suportando pt-BR e en-US nativamente.
