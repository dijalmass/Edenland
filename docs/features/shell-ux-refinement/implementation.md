# Shell UX Refinement: Global Header Layout

A interface da Edenland Shell foi refinada para um layout de "Top Bar" global, unificando todos os controles do sistema em uma única barra superior premium.

## Mudanças na Estrutura

### 1. Header Global (Top Bar)
- **Posicionamento**: Barra fixa no topo (`h-11`), largura total.
- **Visual**: Glassmorphism (`bg-black/10`, `backdrop-blur-md`), borda inferior sutil.
- **Layout**:
  - **Esquerda**: `WorkspaceSwitcher` minimalista.
  - **Centro**: `DateTimeManager` (Relógio e Data).
  - **Direita**: Cápsula de indicadores de sistema (`Network`, `Audio`, `Battery`, `Display`, `User`).

### 2. Gerenciadores (Minimal Mode)
- Todos os gerenciadores de hardware (`Network`, `Audio`, `Battery`, `Display`) e o `UserManager` ganharam um modo `variant="header"`.
- Neste modo, eles ocupam menos espaço, usando ícones menores e removendo fundos pesados, permitindo uma integração limpa na barra superior.
- Clicar nos ícones continua abrindo os modais/configurações completos.

### 3. Remoção do Dock Lateral
- O dock lateral (aside) foi removido para liberar espaço horizontal, permitindo que o compositor (Hyprland) utilize todo o espaço abaixo do header para o tiling das janelas.

## Benefícios
- **Consistência**: Alinha o Edenland com os padrões de design de shells modernas (GNOME, macOS).
- **Espaço Útil**: Maximiza a área de trabalho para as aplicações.
- **Foco**: Centraliza as informações vitais do sistema em um único local de fácil acesso.
