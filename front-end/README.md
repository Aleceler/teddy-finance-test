# Front-end

SPA React para login, listagem de clientes, seleção e dashboard.

## Stack

| Lib | Uso |
|-----|-----|
| [React 19](https://react.dev) | UI |
| [Vite](https://vitejs.dev) | Bundler e dev server |
| [TypeScript](https://www.typescriptlang.org) | Tipagem |
| [Tailwind CSS](https://tailwindcss.com) | Estilos |
| [React Router](https://reactrouter.com) | Rotas e navegação |
| [TanStack Query](https://tanstack.com/query) | Cache e fetching de API |
| [Zustand](https://zustand.docs.pmnd.rs) | Estado global (auth, clientes selecionados) |
| [Axios](https://axios-http.com) | Cliente HTTP |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Formulários e validação |
| [react-toastify](https://fkhadra.github.io/react-toastify) | Notificações |
| [lucide-react](https://lucide.dev) | Ícones |
| [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/react) | Testes unitários |

## Estrutura

```
src/
├── app/              # Router, providers, entry
├── config/           # Rotas, env
├── features/
│   ├── auth/         # Login
│   ├── clients/      # Listagem, seleção, hooks
│   └── dashboard/    # Dashboard
├── components/       # UI reutilizável, layout
├── stores/           # Zustand (auth, selected clients)
├── lib/              # Axios, query client, query keys
└── types/            # Tipos compartilhados
```

## Variáveis de ambiente

```bash
cp front-end/.env.example front-end/.env
```

```env
VITE_API_URL=http://localhost:3000
```

## Como rodar

### Local (Nx)

```bash
# na raiz do monorepo
npm install
cp front-end/.env.example front-end/.env

npx nx serve @org/front-end
```

Acesse http://localhost:4200 — a API deve estar rodando em `VITE_API_URL`.

### Docker (via raiz)

```bash
docker compose up frontend backend postgres
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npx nx serve @org/front-end` | Dev server (porta 4200) |
| `npx nx build @org/front-end` | Build produção → `front-end/dist` |
| `npx nx test @org/front-end` | Testes Vitest |
| `npx nx lint @org/front-end` | ESLint |
| `npx nx lint @org/front-end -- --fix` | ESLint com auto-fix |
| `npx nx preview @org/front-end` | Preview do build |

## Rotas

| Rota | Página | Protegida |
|------|--------|-----------|
| `/login` | Login | Não |
| `/` | Lista de clientes | Sim |
| `/clientes-selecionados` | Clientes selecionados | Sim |
| `/dashboard` | Dashboard | Sim |

## Testes

```bash
npx nx test @org/front-end
```

Specs em `src/**/*.spec.{ts,tsx}` com setup em `src/test/`.

## Build

```bash
npx nx build @org/front-end
```

> **Linux/CI:** imports devem respeitar o case do filesystem (ex.: `./app/app`, não `./app/App`).
