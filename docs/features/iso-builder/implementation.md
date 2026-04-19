# ISO Builder Implementation

Este documento descreve a implementação da infraestrutura para geração de imagens ISO do Edenland.

## Objetivo
Automatizar a criação de uma imagem Live (baseada em Arch Linux) que contenha o shell do Edenland pré-configurado, com suporte a autologin e interface premium out-of-the-box.

## Estrutura
- **Localização**: `packages/iso-builder`
- **Base**: Archiso (Arch Linux ISO building tool)

## Componentes
1. **Shell Integration**: O binário gerado pelo `@edenland/edenland` (via Tauri) é incorporado à imagem.
2. **Greetd Configuration**: Configurado para realizar autologin na sessão Live.
3. **Hyprland Configuration**: Dotfiles pré-configurados para iniciar o shell e gerenciar as janelas de forma elegante.
4. **Visual Identity**: Wallpapers e esquemas de cores pré-aplicados.

## Configurações de Build
Para builds de produção e geração de ISO, as seguintes configurações são críticas:

### Tauri Bundle Identifier
O identificador do bundle no `tauri.conf.json` deve ser único. 
- **Valor atual**: `com.edenland.shell`

## Como gerar
```bash
bun run build:iso
```

## Changelog de Correções
- **2026-04-19**: Corrigido o erro `com.tauri.dev is not allowed` que impedia o build de produção do shell dentro do fluxo da ISO.
