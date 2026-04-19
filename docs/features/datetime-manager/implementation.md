# Implementação do DateTime Manager

## Visão Geral
Um novo componente responsável por exibir e gerenciar a data e a hora do sistema no shell do Edenland.

## Funcionalidades
- **Integração no Dock Lateral Direito**: Integrado como o primeiro elemento no topo do novo layout do dock vertical.
- **Exibição Dinâmica do Relógio**: Mostra atualizações em tempo real com base nas preferências de formatação do usuário.
- **Aba de Calendário**: Uma visualização simples de calendário indicando o mês, ano e dia atuais.
- **Aba de Configurações**: Opções (toggles) para customizar a exibição do "ícone" no dock:
  - Mostrar Nome do Dia (ex: "Seg", "Mon")
  - Mostrar Data
  - Formatação Normalizada da Data
  - Mostrar Horas
  - Mostrar Minutos
  - Mostrar Segundos
- **Persistência**: As configurações são salvas via `localStorage`, para que as preferências do usuário sejam mantidas mesmo após recarregar a página.

## Estrutura de Arquivos
- `apps/shell/src/components/DateTimeManager/`
  - `DateTimeManager.component.tsx`
  - `DateTimeManager.hook.ts`
  - `DateTimeManager.types.ts`
  - `index.ts`

## Status
- [x] Planejado
- [x] Implementado
- [ ] Testado
