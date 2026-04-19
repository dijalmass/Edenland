# Network Manager

## Visão Geral
Módulo responsável por gerenciar conexões de rede Wi-Fi e Ethernet do sistema, construído para a interface desktop. 

## Requisitos de Design (UI)
- Ficará localizado como um ícone flutuante no topo do lado direito.
- Simularemos um "header" invisível para alinhar este e futuros ícones de status (bateria, som, bluetooth).
- Ao clicar, um componente em formato de **Card** será renderizado mostrando as redes disponíveis.
- **Estrutura de Arquivos:** Segue o padrão atômico definido nas regras do projeto (`.component.tsx`, `.hook.ts`, `.types.ts`).

## Requisitos de Backend (Rust/Tauri)
- Interagir com o `NetworkManager` nativo do Linux (presente na maioria das instalações do Arch).
- Ser capaz de ler o status atual, buscar redes disponíveis e conectar em uma nova rede fornecendo senha.
- Comandos Tauri: `get_network_status`, `list_wifi_networks`, `connect_to_network`.

## Fluxo de Implementação
1. **Fase 1:** Criar a UI estática (Ícone + Card de status).
2. **Fase 2:** Criar os hooks no React para invocar o Tauri.
3. **Fase 3:** Implementar a lógica no backend em Rust (chamando `nmcli` ou dbus-rs).
