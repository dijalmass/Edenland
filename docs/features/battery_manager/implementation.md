# Battery Manager

## Visão Geral
O `Battery Manager` é um componente chave do painel do Edenland, responsável por fornecer feedback visual sobre o status atual da bateria do dispositivo (porcentagem de carga e status de carregamento) e permitir que o usuário selecione diferentes planos de energia do sistema operacional Linux.

## Requisitos
- Exibir ícone de bateria dinâmico de acordo com a carga.
- Exibir a porcentagem de bateria (opcional, configurável via toggle).
- Abrir um modal ao clicar no ícone.
- Permitir a seleção de planos de energia gerenciados pelo `powerprofilesctl`.
- Salvar a preferência de exibição da porcentagem da bateria.

## Arquitetura
- **Frontend**: Segue o padrão de diretório de funcionalidade atômica (`BatteryManager.component.tsx`, `BatteryManager.hook.ts`, `BatteryManager.types.ts`). Renderizado no topo do shell, ao lado do `NetworkManager`.
- **Backend**: Comandos Tauri em Rust interagindo com a interface `/sys/class/power_supply/BAT0` e executando o binário `powerprofilesctl` para ler e definir planos de energia no Linux.
