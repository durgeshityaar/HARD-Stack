import { createClient } from "@hard-stack/auth/client";
import { env } from "@hard-stack/env/client";

/** Better Auth browser client, pointed at the API server. */
export const authClient = createClient(env.VITE_SERVER_URL);

export const { signIn, signUp, signOut, useSession } = authClient;
