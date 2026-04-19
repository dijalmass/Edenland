# Feature: Theme Refinement & i18n

Esta feature foca na flexibilidade do Edenland, permitindo que o usuário controle não apenas a cor de destaque (accent), mas também a identidade base do sistema (cor primária), além de garantir suporte total a internacionalização e transparência sobre o estado de desenvolvimento de módulos críticos.

## Objetivos
- **Personalização Profunda**: Permitir a mudança da cor "verde" base do sistema.
- **Transparência**: Avisar o usuário sobre funcionalidades em desenvolvimento (Display Manager).
- **Internacionalização**: Eliminar strings fixas no código para suportar múltiplos idiomas.

## Arquitetura de Cores
A cor base escolhida pelo usuário gera automaticamente três tons principais:
- `--color-eden-dark`: Fundo absoluto (luminosidade reduzida).
- `--color-eden-slate`: Superfícies e cards (luminosidade intermediária).
- `--color-eden-mist`: Tons sutis e bordas (saturação e luminosidade ajustadas).

## I18n
Todas as strings do Display Manager foram movidas para os arquivos de localidade sob o namespace `display`.

## Considerações Técnicas
- As cores são aplicadas via `document.documentElement.style.setProperty`.
- A persistência é feita via `localStorage` para carregamento imediato no shell.
