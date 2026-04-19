# Edenland ISO Builder 💿

Este pacote contém as ferramentas e configurações necessárias para gerar a imagem ISO oficial do Edenland baseada em Arch Linux.

## 🛠️ Pré-requisitos

Para buildar a ISO, você precisa estar em um sistema **Arch Linux** (ou derivado) com os seguintes pacotes instalados:

```bash
sudo pacman -S archiso
```

## 🏗️ Como Buildar

### 1. Localmente (Desenvolvimento)
Devido ao uso do Turborepo e buffering de saída, o prompt de senha do `sudo` pode não aparecer corretamente se executado da raiz. Além disso, você precisa garantir que os outros pacotes (como o shell) foram buildados.

**Passos recomendados:**
1.  **Na raiz do projeto**, compile os binários:
    ```bash
    bun run build
    ```
2.  **Valide o sudo** para evitar travamentos:
    ```bash
    sudo -v
    ```
3.  **Entre na pasta** e gere a ISO:
    ```bash
    cd packages/iso-builder && bun run build:iso
    ```

### 2. CI/CD (GitHub Actions / Automatizado)
No CI, o comando pode ser executado diretamente da raiz, pois o Turborepo gerencia as dependências automaticamente e o `sudo` costuma ser configurado como *passwordless*:

```bash
bun run build:iso
```

### 3. Limpeza
Para limpar os diretórios de trabalho e saída (requer `sudo` para remover arquivos protegidos do archiso):

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
