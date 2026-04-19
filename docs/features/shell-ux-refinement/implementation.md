# Shell Integration & UX Refinement

Este documento detalha a implementação do modo de interface nativa do Edenland Shell e as correções de compatibilidade com versões recentes do Hyprland.

## Objetivo
Transformar o Shell de uma aplicação em janela para uma interface de sistema operacional (Desktop Environment) completa, eliminando decorações de janela e corrigindo erros de configuração.

## Alterações Técnicas

### 1. Hyprland Configuration (`hyprland.conf`)
- **Sintaxe Unificada**: Substituição de `windowrulev2` por `windowrule` com prefixos `match:`.
- **Modo Desktop**: Adição de regras para garantir que o processo `edenland` seja tratado como um painel flutuante sem bordas e em tela cheia.
- **Otimização**: Desativação do `hyprpaper` para centralizar a gestão de wallpaper no Shell (React).

### 2. Tauri Configuration (`tauri.conf.json`)
- **Decorações**: Desativadas para remover header e botões nativos.
- **Modo**: Definido como `fullscreen` por padrão.
- **Transparência**: Habilitada para permitir efeitos visuais entre o Shell e o compositor.

### 3. Frontend (React/CSS)
- **Transparência do Body**: Ajuste no `index.css` para permitir que o fundo da janela seja transparente se o wallpaper não estiver carregado ou se houver camadas inferiores.

## Verificação
- [ ] Ausência de barras vermelhas de erro no boot.
- [ ] Shell ocupando 100% da tela sem barras de título.
- [ ] Wallpaper renderizado corretamente via Shell.
