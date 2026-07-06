# Back-end

API REST em NestJS com autenticação JWT, CRUD de clientes, dashboard e observabilidade.

## Stack

| Lib | Uso |
|-----|-----|
| [NestJS](https://nestjs.com) | Framework HTTP, módulos, DI |
| [TypeORM](https://typeorm.io) | ORM + PostgreSQL |
| [Passport](https://www.passportjs.org) + JWT | Autenticação |
| [class-validator](https://github.com/typestack/class-validator) | Validação de DTOs |
| [Swagger](https://docs.nestjs.com/openapi/introduction) | Documentação da API (`/docs`) |
| [Pino](https://getpino.io) (nestjs-pino) | Logs estruturados |
| [prom-client](https://github.com/siimon/prom-client) | Métricas Prometheus (`/metrics`) |
| [Jest](https://jestjs.io) | Testes unitários |
| [Webpack](https://webpack.js.org) | Build de produção |

## Estrutura

```
src/
├── auth/           # Login JWT, guard, seed do admin
├── clients/        # CRUD com soft delete
├── dashboard/      # Totais e métricas agregadas
├── health/         # GET /healthz
├── metrics/        # Prometheus + interceptor HTTP
├── config/         # TypeORM, Pino, validação de env
└── common/         # Filtros globais
```

## Variáveis de ambiente

Copie `back-end/.env.example` ou use o `.env` da raiz:

```env
PORT=3000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=teddy_open_finance
JWT_SECRET=dev_jwt_secret
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:4200
```

## Como rodar

### Local (Nx)

```bash
# na raiz do monorepo
npm install
cp back-end/.env.example back-end/.env   # ou use .env na raiz

npx nx serve @org/back-end
```

Requer PostgreSQL acessível com as credenciais configuradas.

### Docker (via raiz)

```bash
docker compose up backend postgres
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npx nx serve @org/back-end` | Dev server (porta 3000) |
| `npx nx build @org/back-end` | Build Webpack → `back-end/dist` |
| `npx nx test @org/back-end` | Testes Jest |
| `npx nx lint @org/back-end` | ESLint |
| `npx nx lint @org/back-end -- --fix` | ESLint com auto-fix |

## Endpoints principais

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | — | Login (retorna JWT) |
| GET | `/clients` | JWT | Listar clientes |
| POST | `/clients` | JWT | Criar cliente |
| GET | `/clients/:id` | JWT | Detalhe (+ incrementa `accessCount`) |
| PUT | `/clients/:id` | JWT | Atualizar |
| DELETE | `/clients/:id` | JWT | Soft delete |
| GET | `/dashboard` | JWT | Totais e gráficos |
| GET | `/healthz` | — | Health check |
| GET | `/metrics` | — | Prometheus |
| GET | `/docs` | — | Swagger UI |

## Testes

```bash
npx nx test @org/back-end
```

Cobertura em `back-end/test-output/jest/coverage`.
