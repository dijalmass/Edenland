# Monorepo Setup

## Objetivo
Estruturar o repositório como um monorepo para acomodar separadamente o código da interface visual (Tauri + React), arquivos de configuração (configs), bibliotecas Rust compartilhadas (core) e as receitas de compilação da ISO (iso-builder).

## Decisões Técnicas
- **Gerenciador de Pacotes:** Bun (rápido, compatível e atende TypeScript/JavaScript nativamente).
- **Orquestrador de Workspaces:** Turborepo (`turbo.json`) para otimizar os builds de vários pacotes ao mesmo tempo.
- **Estrutura:**
  - `apps/shell`: Frontend e Backend do Tauri.
  - `packages/configs`: Dotfiles e configs isoladas.
  - `packages/core`: Scripts utilitários base do sistema.
  - `packages/iso-builder`: Build da ISO baseada no Arch.

## Status
- [x] Criação das pastas
- [x] Configuração dos workspaces (`package.json` raiz)
- [x] Adição do `turbo.json`
- [ ] Inicialização do `apps/shell`
