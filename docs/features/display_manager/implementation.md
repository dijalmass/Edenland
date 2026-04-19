# Feature: Display Manager

O **Display Manager** é o componente responsável por gerenciar a saída visual do Edenland, incluindo brilho, arranjo físico de monitores e a identidade visual (cores) do sistema.

## Arquitetura

A funcionalidade é dividida entre comandos do sistema via Rust (Backend) e uma interface interativa em React (Frontend).

### Backend (Rust)
- **Brilho**: Utiliza `brightnessctl` para ler e escrever valores de brilho nos arquivos de dispositivos em `/sys/class/backlight/`.
- **Monitores**: Utiliza o protocolo IPC do Hyprland via `hyprctl`.
  - `hyprctl monitors -j`: Para obter a lista detalhada de monitores, resoluções e posições atuais.
  - `hyprctl keyword monitor`: Para aplicar mudanças de posição, resolução e escala dinamicamente.

### Frontend (React)
- **Monitor Canvas**: Uma representação em escala dos monitores disponíveis. Utiliza eventos de mouse/touch para permitir o reposicionamento relativo.
- **Theme Manager**: Interface para alteração de variáveis CSS. As cores são aplicadas ao `:root` do documento e persistidas no `localStorage` para manter a consistência entre sessões.

## Comandos Tauri

| Comando | Descrição | Ferramenta |
|---------|-----------|------------|
| `get_brightness` | Retorna o brilho atual (0-100) | `brightnessctl` |
| `set_brightness` | Define o brilho | `brightnessctl` |
| `get_monitors` | Lista monitores ativos | `hyprctl` |
| `apply_monitor_config` | Aplica nova posição/resolução | `hyprctl` |

## Estrutura de Cores

As cores principais que podem ser alteradas são:
- **Primary (Glory Gold)**: `--color-glory-gold`
- **Background (Eden Dark)**: `--color-eden-dark`
- **Surface (Eden Slate)**: `--color-eden-slate`

## Roadmap Futuro
- Suporte a Wallpapers integrando um seletor de arquivos nativo.
- Perfis de cores (ICC).
- Filtro de luz azul (Night Light) automático baseado em horário.
