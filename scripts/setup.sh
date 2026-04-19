#!/bin/bash

# Edenland Setup Script
# Este script instala as dependências necessárias para desenvolver e rodar o Edenland no Linux.

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===> Edenland Setup <===${NC}"

# Detectar Distro
if [ -f /etc/arch-release ]; then
    echo -e "${BLUE}Detectado: Arch Linux${NC}"
    sudo pacman -Syu --needed \
        base-devel \
        curl \
        wget \
        file \
        openssl \
        appmenu-gtk-module \
        libappindicator-gtk3 \
        librsvg \
        libsoup \
        webkit2gtk-4.1 \
        networkmanager \
        git
elif [ -f /etc/debian_version ]; then
    echo -e "${BLUE}Detectado: Debian/Ubuntu${NC}"
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        curl \
        wget \
        file \
        libssl-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev \
        libsoup2.4-dev \
        libwebkit2gtk-4.1-dev \
        network-manager \
        git
else
    echo -e "\033[0;31mDistribuição não suportada automaticamente pelo script.\033[0m"
    echo "Por favor, instale as dependências do Tauri e o NetworkManager manualmente."
fi

# Instalar Rust se não existir
if ! command -v rustc &> /dev/null; then
    echo -e "${BLUE}Instalando Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
else
    echo -e "${GREEN}Rust já está instalado.${NC}"
fi

# Instalar Bun se não existir
if ! command -v bun &> /dev/null; then
    echo -e "${BLUE}Instalando Bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    source $HOME/.bashrc
else
    echo -e "${GREEN}Bun já está instalado.${NC}"
fi

# Habilitar NetworkManager
echo -e "${BLUE}Habilitando NetworkManager...${NC}"
sudo systemctl enable --now NetworkManager

echo -e "${GREEN}===> Setup concluído com sucesso! <===${NC}"
echo "Dica: Você pode precisar reiniciar seu terminal para que as alterações no PATH (Rust/Bun) entrem em vigor."
echo "Para rodar o projeto agora: bun run tauri"
