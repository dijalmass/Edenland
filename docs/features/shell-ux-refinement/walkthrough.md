# Walkthrough - Shell UX & Hyprland Fixes

As melhorias de interface foram aplicadas para transformar o Edenland Shell em uma interface nativa de sistema, eliminando o aspecto de "aplicação em janela".

## O que foi feito

### 1. Hyprland: Correção de Erros e Regras de Interface
- **Sintaxe Unificada**: Atualizadas as linhas 74-76 do `hyprland.conf` para usar a nova sintaxe `windowrule` com `match:class`, eliminando as mensagens de erro de depreciação vistas no screenshot.
- **Modo Nativo**: Adicionada a regra `fullscreen` e `pin` para garantir que o Shell ocupe toda a tela e não seja movido acidentalmente.
- **Redundância de Wallpaper**: Comentada a linha do `hyprpaper` (linha 14) para que o Shell gerencie o papel de parede sozinho, economizando memória e evitando conflitos visuais.

### 2. Tauri: Modo "Kiosk" e Sem Bordas
- **`decorations: false`**: Removido o header (título e botões de fechar/minimizar) que fazia o sistema parecer uma janela comum.
- **`fullscreen: true`**: O app agora inicia automaticamente em tela cheia.
- **`transparent: true`**: Habilitada a transparência no nível da janela do Tauri.

### 3. CSS: Refinamento de Camadas
- **`background-color: transparent`**: O fundo do `body` foi alterado para transparente, permitindo que o wallpaper definido no `App.tsx` (ou o fundo do Hyprland) seja visível sem bloqueios de cor sólida.
- **`overflow: hidden`**: Adicionado para evitar barras de rolagem indesejadas no nível da janela.

## Como Validar
1. Recompile a ISO (`npm run build:iso`).
2. Inicie no QEMU.
3. **Resultado Esperado**: O sistema deve iniciar sem mensagens de erro vermelhas no topo e o Shell deve carregar ocupando 100% da tela, sem nenhuma borda ou título superior.

## Próximos Passos Sugeridos
- Implementar um atalho de emergência (ex: `SUPER+Enter`) no `hyprland.conf` para abrir um terminal caso o Shell trave.
- Adicionar controles de sessão (Desligar/Reiniciar) dentro do componente de Usuário do Shell, já que os botões nativos da janela foram removidos.
