import { auth } from "@hard-stack/auth";
import { db } from "@hard-stack/db";

/**
 * Builds the per-request tRPC context. Resolves the Better Auth session from
 * the incoming request headers and exposes the db client to every procedure.
 */
export async function createContext({ headers }: { headers: Headers }) {
  const data = await auth.api.getSession({ headers });

  return {
    db,
    session: data?.session ?? null,
    user: data?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
