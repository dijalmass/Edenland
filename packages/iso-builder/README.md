# Edenland ISO Builder 💿

Este pacote contém as ferramentas e configurações necessárias para gerar a imagem ISO oficial do Edenland baseada em Arch Linux.

## 🛠️ Pré-requisitos

Para buildar a ISO, você precisa estar em um sistema **Arch Linux** (ou derivado) com os seguintes pacotes instalados:

```bash
sudo pacman -S archiso
```

## 🏗️ Como Buildar

O processo é automatizado via Turborepo e scripts internos. Siga os passos abaixo:

### 1. Gerar a ISO (Recomendado)
O Turborepo cuidará de compilar o shell e preparar os binários automaticamente:

```bash
# Na raiz do projeto
bun run build:iso
```

### 2. Manualmente (Caso necessário)
Se preferir compilar as etapas separadamente:

1. Compile o shell: `bun run build`
2. Prepare a ISO: `cd packages/iso-builder && bun run build:iso`

### 3. Limpeza
Se precisar resetar o ambiente de build (limpar cache do archiso):

```bash
bun run clean
```

## 📂 Estrutura da ISO

- **airootfs/**: Contém os arquivos que serão copiados para o sistema de arquivos da ISO (ex: `/etc/edenland`, `/usr/bin/edenland-shell`).
- **packages.x86_64**: Lista de pacotes que serão instalados na ISO.
- **profiledef.sh**: Configurações principais da ISO (nome, labels, permissões de arquivos).

## 🚀 O que há na ISO?

- **Autologin**: Inicia automaticamente no usuário `archuser`.
- **Sessão Edenland**: O compositor Hyprland inicia automaticamente carregando o `edenland-shell`.
- **Instalador Offline**: O script `install.sh` está disponível na pasta home para instalar o sistema permanentemente no disco.
