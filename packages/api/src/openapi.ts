import { generateOpenApiDocument } from "trpc-to-openapi";
import { appRouter } from "./root";

/**
 * OpenAPI 3 document generated from the tRPC routers' `.meta({ openapi })`.
 * Served as JSON by the server and rendered by Scalar at /reference.
 */
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Hard Stack API",
  version: "1.0.0",
  description: "REST surface generated from the tRPC routers.",
  baseUrl: "/api",
});
