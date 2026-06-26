import { createAuthClient } from "better-auth/react";

/**
 * Create a Better Auth client pointed at the auth server. The web app calls
 * this with its configured server URL (see apps/web/src/lib/auth.ts).
 */
export function createClient(baseURL: string) {
  return createAuthClient({ baseURL });
}

export type AuthClient = ReturnType<typeof createClient>;
