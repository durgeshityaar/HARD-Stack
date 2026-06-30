import { type Todo, todo } from "@hard-stack/db";
import { byIdSchema, createTodoSchema, updateTodoSchema } from "@hard-stack/validators";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const todoOutput = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

function serialize(row: Todo) {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    userId: row.userId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/**
 * Todos are scoped to the signed-in user: every procedure is protected and
 * filters by `ctx.user.id`, so one user can never read or mutate another's.
 */
export const todoRouter = router({
  all: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/todos",
        tags: ["todos"],
        summary: "List your todos",
        protect: true,
      },
    })
    .input(z.object({}))
    .output(z.array(todoOutput))
    .query(async ({ ctx }) => {
      const rows = await ctx.db
        .select()
        .from(todo)
        .where(eq(todo.userId, ctx.user.id))
        .orderBy(desc(todo.createdAt));
      return rows.map(serialize);
    }),

  byId: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/todos/{id}",
        tags: ["todos"],
        summary: "Get one of your todos",
        protect: true,
      },
    })
    .input(byIdSchema)
    .output(todoOutput)
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(todo)
        .where(and(eq(todo.id, input.id), eq(todo.userId, ctx.user.id)))
        .limit(1);
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }
      return serialize(row);
    }),

  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/todos",
        tags: ["todos"],
        summary: "Create a todo",
        protect: true,
      },
    })
    .input(createTodoSchema)
    .output(todoOutput)
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .insert(todo)
        .values({ title: input.title, userId: ctx.user.id })
        .returning();
      if (!row) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create todo",
        });
      }
      return serialize(row);
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/todos/{id}",
        tags: ["todos"],
        summary: "Update a todo (title and/or completed)",
        protect: true,
      },
    })
    .input(updateTodoSchema)
    .output(todoOutput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...changes } = input;
      if (changes.title === undefined && changes.completed === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provide a title and/or completed",
        });
      }
      const [row] = await ctx.db
        .update(todo)
        .set(changes)
        .where(and(eq(todo.id, id), eq(todo.userId, ctx.user.id)))
        .returning();
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }
      return serialize(row);
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/todos/{id}",
        tags: ["todos"],
        summary: "Delete a todo",
        protect: true,
      },
    })
    .input(byIdSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .delete(todo)
        .where(and(eq(todo.id, input.id), eq(todo.userId, ctx.user.id)))
        .returning({ id: todo.id });
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }
      return { id: row.id };
    }),
});
