import { appRouter, createContext, openApiDocument } from "@hard-stack/api";
import type { Hono } from "hono";
import { createOpenApiFetchHandler } from "trpc-to-openapi";

/**
 * Serves the generated OpenAPI document plus a REST surface for every tRPC
 * procedure that carries `.meta({ openapi })`, mounted under /api.
 *
 * Registered after the Better Auth handler (which owns /api/auth/**) so auth
 * routes are matched first.
 */
export function registerOpenApi(app: Hono) {
  app.get("/openapi.json", (c) => c.json(openApiDocument));

  app.all("/api/*", (c) =>
    createOpenApiFetchHandler({
      req: c.req.raw,
      endpoint: "/api",
      router: appRouter,
      createContext: () => createContext({ headers: c.req.raw.headers }),
    }),
  );
}
