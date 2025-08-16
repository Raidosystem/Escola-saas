# SME SaaS

Sistema SaaS municipal de ensino completo, com Next.js, Supabase, FastAPI, Go, Redis, CI/CD, testes, acessibilidade, PWA e documentação.

## Estrutura
- apps/web: Frontend Next.js (App Router)
- apps/reporting: FastAPI (PDF/Excel)
- apps/rt: Go (WebSocket)
- packages: Config, UI, Types
- supabase: Migrations, Seeds

## Setup
1. Copie `.env.example` para `.env` e preencha as variáveis.
2. Instale dependências: `npm install` (scripts usam npm workspaces; entradas "pnpm" serão ajustadas futuramente ou substitua por pnpm se preferir).
3. Rode as migrações Supabase (local CLI ou dashboard) e aplique seeds.
4. Frontend: `npm run dev` (ou `npm --workspace web run dev`).
5. Reporting (FastAPI):
	- Local rápido (requer Python 3.11+ e deps): `pip install -e apps/reporting[dev]` e `npm run serve:reporting`.
	- Docker: `npm run docker:reporting`.
	- Auth: enviar header `Authorization: Bearer $REPORTING_AUTH_TOKEN` para endpoints protegidos.
6. RT (Go): `go run apps/rt/main.go` (WebSocket em `/ws?channel=frequencia:<turma_id>`)

## Deploy
- Frontend/APIs Next: Vercel
- Reporting FastAPI: Docker image (ex: Cloud Run / Fly.io)
- Go Realtime: idem (a criar)
- Banco: Supabase gerenciado

## Testes
- Unitários: Vitest (`npm test`)
- Cobertura: `npm run test:coverage`
- E2E: (a adicionar) Playwright
- Meta: Cobertura >= 80% domínios críticos

## CI/CD
- .github/workflows/ci.yml

## Auth Reporting
Defina `REPORTING_AUTH_TOKEN` no `.env` e use header Bearer para `/fechamento` e `/relatorio/*`.

## Próximos
- Integração frontend -> WS para presença em tempo real
- RLS adicional para módulos restantes
- PWA (manifest + service worker)
- Seeds abrangentes
- Observabilidade (OTel)

## Realtime
O serviço Go assina Redis (`frequencia:*`) e retransmite via WS. Publicações podem ser feitas pelo backend (ex: após inserir frequências) para atualizar dashboards instantaneamente.

Documentação completa em evolução.
