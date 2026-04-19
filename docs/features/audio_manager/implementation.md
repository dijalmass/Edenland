# Implementação: AudioManager

## Visão Geral
O `AudioManager` é responsável por fornecer uma interface intuitiva e premium para o controle de áudio no Edenland. Ele se integra ao PulseAudio/PipeWire através do utilitário `pactl`.

## Arquitetura

### Backend (Rust)
Localizado em `apps/shell/src-tauri/src/audio.rs`.
Utiliza `std::process::Command` para executar `pactl -f json`.

**Estruturas de Dados:**
- `AudioStatus`: { volume, mute, default_sink }
- `AudioSink`: { index, name, description, volume, mute }
- `AudioApp`: { index, name, volume, mute }

### Frontend (React)
Localizado em `apps/shell/src/components/AudioManager/`.

**Componentes:**
- `AudioManager.tsx`: Ícone no Dock com barra de progresso circular ou linear para volume.
- `AudioModal.tsx`: Painel central com:
    - Slider de volume mestre.
    - Seleção de saída (Dropdown ou Lista).
    - Seção "Aplicações" com sliders individuais.

## Comandos Tauri
- `get_audio_status`
- `get_output_devices`
- `get_app_volumes`
- `set_master_volume`
- `set_master_mute`
- `set_default_sink`
- `set_app_volume`

## Estilização
- Glassmorphism (Backdrop blur, transparência).
- Animações suaves de hover e abertura de modal.
- Cores harmoniosas.
