import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { OpenApiMeta } from "trpc-to-openapi";
import { ZodError, z } from "zod";
import type { Context } from "./context";

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: error.cause instanceof ZodError ? z.flattenError(error.cause) : null,
        },
      };
    },
  });

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

/** A procedure available to anyone. */
export const publicProcedure = t.procedure;

/** A procedure that requires an authenticated session. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { ...ctx, session: ctx.session, user: ctx.user },
  });
});
