---
title: Getting Started
description: Run the Hard Stack monorepo locally.
---

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3
- A Postgres database (local Docker, Postgres.app, Neon, Supabase, …)

## Setup

```sh
# 1. Install dependencies (resolves the workspace graph)
bun install

# 2. Configure environment
cp .env.example .env
# then fill in DATABASE_URL, BETTER_AUTH_SECRET, RESEND_API_KEY, …

# 3. Push the schema to your database
bun run db:push

# 4. Run everything
bun run dev
```

## What runs where

| App          | URL                            | Notes                          |
| ------------ | ------------------------------ | ------------------------------ |
| `web`        | http://localhost:5173          | React SPA                      |
| `server`     | http://localhost:3000          | Hono — tRPC, auth, OpenAPI     |
| `docs`       | http://localhost:4321          | This site                      |
| API Reference| http://localhost:3000/reference| Scalar, from the OpenAPI spec  |

## Common scripts

```sh
bun run typecheck   # turbo run typecheck across the graph
bun run lint        # turbo run lint (Biome)
bun run build       # build every app
bun run db:studio   # Drizzle Studio
```
