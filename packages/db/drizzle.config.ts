import { defineConfig } from "drizzle-kit";

// Read the URL directly from the environment so `drizzle-kit generate` works
// without booting the full typed-env validation (no DB connection needed).
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required to run drizzle-kit");
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
