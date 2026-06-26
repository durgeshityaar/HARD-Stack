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

export const createPostSchema = z.object({
  title: z.string().min(1).max(256),
  content: z.string().min(1),
});
export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string(),
});
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const byIdSchema = z.object({ id: z.string() });
export type ById = z.infer<typeof byIdSchema>;
