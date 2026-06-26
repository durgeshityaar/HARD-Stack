# Hard Stack

A typed, end-to-end TypeScript monorepo on **Bun** + **Turbo**.

```
Hono · tRPC · Drizzle · Better Auth · Resend/React Email · TanStack · Tailwind v4 · Astro/Starlight · Biome
```

## Layout

```
apps/
  server/   Hono entry — wires auth, tRPC, OpenAPI + Scalar
  web/      React 19 + Vite SPA — TanStack Router/Query, tRPC client, shadcn
  docs/     Astro + Starlight
packages/
  env/         typed env (fail-fast at boot) — server.ts / client.ts
  logger/      LogTape setup + getLogger
  db/          Drizzle schema + client + migrations (Postgres)
  auth/        Better Auth (index = server, client = browser)
  email/       Resend + React Email templates
  validators/  shared Zod schemas
  api/         tRPC routers + OpenAPI document
tooling/
  typescript/  shared tsconfig (base, react)
  biome/       shared Biome config
```

Internal packages export their TypeScript source directly (no build step) and
are consumed via `moduleResolution: "Preserve"`.

## Quickstart

```sh
bun install
cp .env.example .env   # then fill in the values
bun run db:push        # push schema to Postgres
bun run dev            # everything, via Turbo
```

| App           | URL                             |
| ------------- | ------------------------------- |
| web           | http://localhost:5173           |
| server        | http://localhost:3000           |
| docs          | http://localhost:4321           |
| API reference | http://localhost:3000/reference |

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `bun run dev`       | Run all apps (Turbo, persistent)     |
| `bun run build`     | Build every app                      |
| `bun run typecheck` | `tsc --noEmit` across the graph      |
| `bun run lint`      | Biome check across the graph         |
| `bun run lint:fix`  | Biome check + autofix at the root    |
| `bun run db:push`   | Drizzle: push schema                 |
| `bun run db:generate` / `db:migrate` | Drizzle migrations  |
| `bun run db:studio` | Drizzle Studio                       |

## Conventions

- **Env** is validated once at boot in `packages/env`; importing a missing
  secret fails fast.
- **The API is defined once** as tRPC routers; procedures with
  `.meta({ openapi })` are also exposed as REST and documented via OpenAPI.
- **Lefthook** runs Biome + typecheck pre-commit.
