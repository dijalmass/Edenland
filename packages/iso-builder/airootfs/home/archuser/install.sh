#!/bin/bash

# Edenland Installer & Updater
# Este script instala ou atualiza o Edenland Shell em um sistema Arch Linux.

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}===> Edenland Installer/Updater <===${NC}"

# 1. Verificações Iniciais
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}Por favor, não execute este script como root diretamente. Use um usuário normal com sudo.${NC}"
    exit 1
fi

if [ ! -f /etc/arch-release ]; then
    echo -e "${RED}Erro: Edenland é otimizado exclusivamente para Arch Linux no momento.${NC}"
    exit 1
fi

# 2. Instalação de Dependências de Runtime
echo -e "${BLUE}Instalando dependências de sistema...${NC}"
sudo pacman -Syu --needed --noconfirm \
    wayland \
    hyprland \
    pipewire \
    pipewire-pulse \
    wireplumber \
    networkmanager \
    bluez \
    bluez-utils \
    brightnessctl \
    powerprofilesctl \
    polkit-gnome \
    xdg-desktop-portal-hyprland \
    qt5-wayland \
    qt6-wayland \
    librsvg \
    jq \
    hyprpaper \
    greetd \
    greetd-tuigreet

# 3. Configuração do Compositor (Hyprland como base)
# 3. Configuração do Compositor & Temas
echo -e "${BLUE}Configurando ambiente de sessão e dotfiles...${NC}"
mkdir -p ~/.config/edenland/wallpapers
mkdir -p ~/.config/hypr

# Se estivermos no repositório, copiar o oficial.
if [ -d "./packages/configs" ]; then
    echo -e "${BLUE}Copiando dotfiles oficiais do Edenland...${NC}"
    
    # Hyprland
    cp ./packages/configs/hyprland/edenland.conf ~/.config/hypr/edenland.conf
    cp ./packages/configs/hyprland/hyprpaper.conf ~/.config/hypr/hyprpaper.conf
    
    # Greetd (Login Manager)
    echo -e "${BLUE}Configurando tela de login (greetd)...${NC}"
    sudo mkdir -p /etc/greetd
    sudo cp ./packages/configs/greetd/config.toml /etc/greetd/config.toml
    sudo systemctl enable greetd.service
    
    # Wallpapers
    cp -r ./packages/configs/wallpapers/* ~/.config/edenland/wallpapers/
    
    echo -e "${GREEN}Configurações, Tela de Login e Wallpapers aplicados.${NC}"
else
    echo -e "${YELLOW}Aviso: Pasta de configurações não encontrada localmente. Criando fallback básico...${NC}"
    cat <<EOF > ~/.config/hypr/edenland.conf
# Edenland Hyprland Fallback Config
monitor=,preferred,auto,1
exec-once = edenland-shell
general { gaps_in = 0; gaps_out = 0; border_size = 0; }
decoration { rounding = 0; drop_shadow = false; }
EOF
fi

# 4. Criação da Entrada de Sessão Wayland
echo -e "${BLUE}Registrando sessão Edenland...${NC}"
sudo mkdir -p /usr/share/wayland-sessions/
sudo bash -c "cat <<EOF > /usr/share/wayland-sessions/edenland.desktop
[Desktop Entry]
Name=Edenland
Comment=Pure and Distraction-free Desktop Environment
Exec=Hyprland --config ~/.config/hypr/edenland.conf
Type=Application
DesktopNames=Edenland
EOF"

# 5. Lógica de Atualização / Download do Binário
REPO="dijalmass/edenland"
BINARY_NAME="edenland-shell" # Nome esperado do asset no release
INSTALL_PATH="/usr/bin/$BINARY_NAME"
VERSION_DIR="/usr/share/edenland"
VERSION_FILE="$VERSION_DIR/version"

echo -e "${BLUE}Verificando atualizações no GitHub...${NC}"

# Obter última versão via API do GitHub
LATEST_RELEASE=$(curl -s "https://api.github.com/repos/$REPO/releases/latest")
LATEST_VERSION=$(echo "$LATEST_RELEASE" | jq -r '.tag_name')

if [ "$LATEST_VERSION" == "null" ] || [ -z "$LATEST_VERSION" ]; then
    echo -e "${YELLOW}Nenhum release público encontrado em $REPO.${NC}"
    echo -e "Como o projeto está em desenvolvimento, você deve compilar manualmente:"
    echo -e "${BLUE}bun run tauri build${NC}"
else
    CURRENT_VERSION="none"
    if [ -f "$VERSION_FILE" ]; then
        CURRENT_VERSION=$(cat "$VERSION_FILE")
    fi

    if [ "$LATEST_VERSION" != "$CURRENT_VERSION" ]; then
        echo -e "${GREEN}Nova versão encontrada: $LATEST_VERSION (Atual: $CURRENT_VERSION)${NC}"
        
        # Encontrar o asset correto (ex: linux x86_64)
        DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | jq -r ".assets[] | select(.name | contains(\"x86_64\")) | .browser_download_url")

        if [ -z "$DOWNLOAD_URL" ] || [ "$DOWNLOAD_URL" == "null" ]; then
            echo -e "${RED}Erro: Não foi possível encontrar um binário compatível no release $LATEST_VERSION.${NC}"
        else
            echo -e "${BLUE}Baixando $LATEST_VERSION...${NC}"
            curl -L "$DOWNLOAD_URL" -o /tmp/edenland-shell
            
            echo -e "${BLUE}Instalando binário...${NC}"
            sudo mv /tmp/edenland-shell "$INSTALL_PATH"
            sudo chmod +x "$INSTALL_PATH"
            
            sudo mkdir -p "$VERSION_DIR"
            echo "$LATEST_VERSION" | sudo tee "$VERSION_FILE" > /dev/null
            echo -e "${GREEN}Edenland atualizado para $LATEST_VERSION com sucesso!${NC}"
        fi
    else
        echo -e "${GREEN}O Edenland já está na versão mais recente ($CURRENT_VERSION).${NC}"
    fi
fi

# 6. Finalização
echo -e "${GREEN}===> Operação concluída! <===${NC}"
echo "Sessão registrada em: /usr/share/wayland-sessions/edenland.desktop"
echo "Binário instalado em: $INSTALL_PATH"
echo -e "\n${BLUE}Dica:${NC} Se você estiver em uma sessão Edenland, reinicie para aplicar as mudanças."
