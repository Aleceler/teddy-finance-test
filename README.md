# Teddy Open Finance

Monorepo [Nx](https://nx.dev) com API NestJS e SPA React para gestão de clientes.

## Estrutura

```
teddy-open-finance/
├── back-end/          # API NestJS
├── front-end/         # SPA React + Vite
├── .github/workflows/ # CI (GitHub Actions)
└── docker-compose.yml # Stack completa (postgres + api + web)
```

## Pré-requisitos

- Node.js LTS
- npm
- Docker (opcional, para stack completa)

## Setup

```bash
cp .env.example .env
npm install
```

Para desenvolvimento local, ajuste `DATABASE_PORT` e `CORS_ORIGIN` no `.env` conforme seu ambiente.

## Comandos (raiz)

| Comando | Descrição |
|---------|-----------|
| `npm run lint` | Lint back-end + front-end |
| `npm run lint:fix` | Lint com auto-fix |
| `npx nx serve @org/back-end` | API em modo dev |
| `npx nx serve @org/front-end` | Front em modo dev |
| `npx nx build @org/back-end` | Build da API |
| `npx nx build @org/front-end` | Build do front |
| `npx nx test @org/back-end` | Testes Jest |
| `npx nx test @org/front-end` | Testes Vitest |
| `npx nx lint @org/back-end` | Lint da API |
| `npx nx lint @org/front-end` | Lint do front |
| `npx nx e2e back-end-e2e` | E2E API (Playwright) |
| `npx nx e2e front-end-e2e` | E2E UI (Playwright) |
| `npx nx graph` | Grafo de dependências Nx |

## Docker

Stack completa com hot reload:

```bash
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Front-end | http://localhost:4200 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/docs |
| Health | http://localhost:3000/healthz |
| Métricas | http://localhost:3000/metrics |

Login padrão (Docker): `admin@example.com` / `admin123`

## E2E (Playwright)

Requer PostgreSQL acessível (ex.: `docker compose up postgres`) e browsers instalados:

```bash
npx playwright install chromium
npx nx e2e back-end-e2e
npx nx e2e front-end-e2e
```

Credenciais lidas do `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

## CI/CD

Dois workflows separados no GitHub Actions (sem deploy):

| Workflow | Arquivo | Etapas |
|----------|---------|--------|
| Backend CI | `.github/workflows/backend.yml` | install → lint → test → build |
| Frontend CI | `.github/workflows/frontend.yml` | install → lint → test → build |

- Node LTS (`lts/*`)
- Cache npm + cache Nx (`.nx/cache`)
- Disparam em push/PR nas pastas relevantes ou via `workflow_dispatch`

## Documentação por projeto

- [Back-end](./back-end/README.md) — API, módulos, variáveis de ambiente
- [Front-end](./front-end/README.md) — SPA, libs, estrutura de features
