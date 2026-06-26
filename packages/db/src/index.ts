import { env } from "@hard-stack/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * A single shared postgres connection + Drizzle client. The `schema` is passed
 * so the relational query API (`db.query.*`) and Better Auth adapter work.
 */
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema, casing: "snake_case" });

export * from "./schema";
export { schema };
export type Db = typeof db;
