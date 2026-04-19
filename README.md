# Edenland

Edenland é um ambiente desktop nativo Wayland, construído sobre o Arch Linux, que desafia os paradigmas tradicionais de interfaces WIMP (Windows, Icons, Menus, Pointers). Focado em pureza, velocidade e uma experiência orientada a comandos, o Edenland utiliza tecnologias web de ponta para renderizar uma interface minimalista, modular e extensível.

> "Uma nova fundação para quem busca um ambiente puro e sem distrações."

## Visão Geral

Ao contrário de interfaces que imitam o Windows ou macOS, o Edenland propõe:
- Command-First: A interação central nasce de uma paleta de comandos inteligente.
- Card-Based UI: Aplicativos e utilitários de sistema são tratados como componentes fluidos.
- Local-First: Estado do sistema e configurações gerenciados com latência zero.
- Pureza Arch: Uma base enxuta, sem bloatware, otimizada para performance máxima.

## Tech Stack

- OS: Arch Linux (Base Pura)
- Display Server: Wayland
- UI Engine: React + TypeScript
- Runtime & Package Manager: Bun
- System Bridge: Tauri (Rust) para integração de baixo nível
- Styling: Tailwind CSS
- ISO Building: Archiso

## Estrutura do Monorepo

O projeto utiliza uma estrutura de monorepo para separar a interface, o provisionamento e a construção da imagem do sistema:

edenland/
├── apps/
│   └── shell/            # Interface React + Tauri (Painéis, Command Palette)
├── packages/
│   ├── configs/          # Dotfiles e configurações base do sistema
│   ├── core/             # Scripts de integração Rust/System
│   └── iso-builder/      # Receitas do Archiso para gerar a .iso
├── scripts/
│   └── install.sh        # Script de instalação via curl
└── turbo.json            # Orquestração do build (Turborepo)

## Começando (Desenvolvimento)

Para rodar o ambiente de desenvolvimento dentro do seu sistema atual (Nested Session):

### Pré-requisitos
- Bun instalado
- Rust e Cargo (para o Tauri)
- Bibliotecas de desenvolvimento do Wayland

### Instalação
1. Clone o repositório:
   git clone https://github.com/seu-usuario/edenland.git

2. Instale as dependências:
   cd edenland
   bun install

3. Execute a UI em modo de desenvolvimento:
   bun run dev --filter @edenland/shell

## Distribuição

O Edenland pode ser consumido de duas formas:

1. Script de Pós-Instalação: Para quem já possui uma instalação limpa do Arch.
   curl -sL https://raw.githubusercontent.com/seu-usuario/edenland/main/install.sh | bash

2. Edenland ISO: Uma imagem pronta para boot, configurada para instalar o sistema completo com a interface nativa.

## Roadmap

- [ ] Arquitetura base do Compositor Wayland (via wlroots ou Tauri bridge).
- [ ] Protótipo da Paleta de Comandos (Command Center).
- [ ] Sistema de temas dinâmicos via TypeScript.
- [ ] Script de automação de instalação do Arch (Eden-Installer).
- [ ] Pipeline de CI/CD para gerar ISOs semanais.

## Licença

Distribuído sob a licença MIT. Veja LICENSE para mais informações.

---
Desenvolvido por Dijalma Silva
