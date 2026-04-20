# Implementation: Package Manager (Edenland Store)

Este documento descreve a arquitetura e os detalhes técnicos do Gerenciador de Pacotes unificado do Edenland.

## Arquitetura Unificada

O Gerenciador de Pacotes atua como um wrapper em torno do `pacman` (repositórios oficiais) e do `yay` (AUR). A lógica prioriza o `yay` para garantir acesso ao vasto catálogo do AUR, mas mantém compatibilidade com sistemas onde apenas o `pacman` está disponível.

### Fluxo de Busca

1. O usuário digita no input.
2. Um debounce de 1000ms é aplicado.
3. O frontend chama o comando `search_packages`.
4. O backend executa `yay -Ss <query>` ou `pacman -Ss <query>`.
5. A saída (STDOUT) é processada linha a linha para construir objetos `Package`.

### Fluxo de Instalação/Remoção

1. O usuário clica em "Instalar" ou "Remover".
2. O frontend verifica se já possui a senha em cache (opcional/sessão) ou dispara o `AuthModal`.
3. Com a senha validada, o backend executa o comando via `sudo -S`.
4. O progresso é notificado ao frontend via eventos Tauri (se necessário para processos longos).

## Backend (Rust)

### Estruturas

```rust
pub struct Package {
    pub name: String,
    pub version: String,
    pub description: String,
    pub repository: String,
    pub is_installed: bool,
}
```

### Comandos Tauri

- `search_packages(query)` -> `Vec<Package>`
- `get_package_info(name)` -> `PackageDetails`
- `execute_package_action(action, name, password)` -> `Result<(), String>`

## Frontend (React)

### Componentes

- **PackageManager**: Container principal.
- **SearchInput**: Input com debounce e feedback visual de carregamento.
- **PackageList**: Grid/Lista de resultados.
- **PackageDetails**: Popover com detalhes estendidos.
- **AuthModal**: Modal global de confirmação de privilégios.

### Estado (Zustand/Context)

- `isSearching`: booleano.
- `results`: Lista de pacotes.
- `isAuthenticated`: Controle temporário da sessão sudo.

## Console de Instalação (UX Refinement)

Para garantir que o usuário esteja ciente de processos bloqueantes (visto que `pacman` e `yay` não permitem múltiplas instâncias simultâneas), o console de instalação segue estas regras:

### Estados do Terminal
1. **Closed (Fechado)**: O estado padrão quando nenhuma operação foi realizada ou após o usuário fechar manualmente um processo finalizado.
2. **Minimized (Compacto)**:
   - Mostra apenas o header do console e a **última linha do log**.
   - Inclui uma barra de progresso indeterminada estilizada.
   - Ideal para acompanhar o progresso sem obstruir a visualização de outros pacotes.
3. **Expanded (Expandido)**:
   - Terminal completo com histórico de logs, numeração de linhas e cores ANSI (sucesso/erro).
   - Abre automaticamente ao iniciar qualquer ação de instalação ou remoção.

### Regras de Interação
- **Bloqueio de Fechamento**: Enquanto um processo estiver ativo (`isExecuting`), o botão de fechar (X) fica oculto. O usuário só pode alternar entre os estados *Compacto* e *Expandido*.
- **Cancelamento**: Botão dedicado de cancelamento disponível durante a execução.
- **Limpeza**: Opção de limpar o histórico de logs disponível quando o terminal está expandido e em repouso.

## Segurança

As permissões são controladas pelo Tauri v2 via:
- `src-tauri/permissions/package.toml`: Define o acesso aos comandos.
- `capabilities/default.json`: Ativa as permissões para a janela principal.
