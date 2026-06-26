import { type Post, post } from "@hard-stack/db";
import { byIdSchema, createPostSchema } from "@hard-stack/validators";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const postOutput = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

function serialize(row: Post) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    authorId: row.authorId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const postRouter = router({
  all: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts",
        tags: ["posts"],
        summary: "List all posts",
      },
    })
    .input(z.object({}))
    .output(z.array(postOutput))
    .query(async ({ ctx }) => {
      const rows = await ctx.db.select().from(post).orderBy(desc(post.createdAt));
      return rows.map(serialize);
    }),

  byId: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/{id}",
        tags: ["posts"],
        summary: "Get a post by id",
      },
    })
    .input(byIdSchema)
    .output(postOutput)
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db.select().from(post).where(eq(post.id, input.id)).limit(1);
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      return serialize(row);
    }),

  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/posts",
        tags: ["posts"],
        summary: "Create a post",
      },
    })
    .input(createPostSchema)
    .output(postOutput)
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .insert(post)
        .values({
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        })
        .returning();
      if (!row) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }
      return serialize(row);
    }),
});
