import { appRouter, createContext } from "@hard-stack/api";
import { auth } from "@hard-stack/auth";
import { env } from "@hard-stack/env/server";
import { getLogger, setupLogging } from "@hard-stack/logger";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { registerOpenApi } from "./openapi";
import { registerScalar } from "./scalar";

await setupLogging(env.NODE_ENV === "production" ? "info" : "debug");
const log = getLogger(["server"]);

const app = new Hono();

app.use("*", honoLogger());
app.use(
  "*",
  cors({
    origin: env.WEB_URL,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Better Auth — owns every /api/auth/** route.
app.on(["GET", "POST"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// tRPC over HTTP at /trpc/*.
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => createContext({ headers: c.req.raw.headers }),
  }),
);

// OpenAPI JSON + generated REST routes under /api, then the Scalar UI.
registerOpenApi(app);
registerScalar(app);

app.get("/", (c) => c.json({ name: "hard-stack", docs: "/reference", health: "/api/health" }));

log.info`Server ready on http://localhost:${env.PORT}`;

export default {
  port: env.PORT,
  fetch: app.fetch,
};
