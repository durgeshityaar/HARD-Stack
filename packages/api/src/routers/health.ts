import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const healthRouter = router({
  check: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/health",
        tags: ["system"],
        summary: "Health check",
      },
    })
    .input(z.object({}))
    .output(z.object({ status: z.literal("ok"), timestamp: z.string() }))
    .query(() => ({
      status: "ok" as const,
      timestamp: new Date().toISOString(),
    })),
});
