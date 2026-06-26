import { Scalar } from "@scalar/hono-api-reference";
import type { Hono } from "hono";

/** Mounts the Scalar API reference UI at /reference, backed by /openapi.json. */
export function registerScalar(app: Hono) {
  app.get(
    "/reference",
    Scalar({
      url: "/openapi.json",
      pageTitle: "Hard Stack API Reference",
    }),
  );
}
