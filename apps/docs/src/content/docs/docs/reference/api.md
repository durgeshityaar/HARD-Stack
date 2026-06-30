---
title: API Reference
description: Where the live, generated API reference lives.
---

The API is defined once as tRPC routers in `packages/api`. Procedures that
carry `.meta({ openapi })` are also exposed as REST endpoints and described by a
generated OpenAPI document.

- **OpenAPI JSON:** [`/openapi.json`](http://localhost:3000/openapi.json)
- **Interactive reference (Scalar):** [`/reference`](http://localhost:3000/reference)

## Consuming the API

### Type-safe (tRPC)

The web app talks to the server over tRPC with full end-to-end types — see
`apps/web/src/lib/trpc.ts`. No code generation, no drift.

### REST / OpenAPI

Any procedure with `openapi` metadata is reachable over plain HTTP under
`/api`, e.g.:

```sh
curl http://localhost:3000/api/health
curl http://localhost:3000/api/posts
```

Generate clients from `/openapi.json` with your tool of choice.
