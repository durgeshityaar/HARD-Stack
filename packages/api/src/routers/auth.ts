import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  me: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/me",
        tags: ["auth"],
        summary: "Get the current authenticated user",
      },
    })
    .input(z.object({}))
    .output(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        emailVerified: z.boolean(),
        image: z.string().nullable(),
      }),
    )
    .query(({ ctx }) => ({
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      emailVerified: ctx.user.emailVerified,
      image: ctx.user.image ?? null,
    })),

  session: publicProcedure.input(z.object({})).query(({ ctx }) => ({
    session: ctx.session,
    user: ctx.user,
  })),
});
