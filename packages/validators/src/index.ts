import { z } from "zod";

/**
 * Shared Zod schemas. These are the single source of truth reused by the API
 * (tRPC input/output + OpenAPI), the web forms, and anywhere else that needs
 * to agree on a shape.
 */

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(128),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = signUpSchema.pick({ email: true, password: true });
export type SignInInput = z.infer<typeof signInSchema>;

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(256),
});
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

// Kept a plain ZodObject (no .refine) so trpc-to-openapi can map the {id} path
// param. The "at least one field" rule is enforced in the todo router.
export const updateTodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(256).optional(),
  completed: z.boolean().optional(),
});
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

export const byIdSchema = z.object({ id: z.string() });
export type ById = z.infer<typeof byIdSchema>;
