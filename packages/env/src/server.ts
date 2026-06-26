import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Server-side environment. Validated once at module load — importing this
 * anywhere fails fast at boot if a required secret is missing or malformed.
 * Never import this from browser code.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    WEB_URL: z.url().default("http://localhost:5173"),

    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),

    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
