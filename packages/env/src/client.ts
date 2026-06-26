import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Browser-safe environment. Only `VITE_`-prefixed variables are exposed to
 * the client bundle, so nothing secret can leak here.
 *
 * `import.meta.env` is accessed via a cast so this module type-checks without
 * pulling in Vite's ambient types (the web app augments them itself).
 */
const runtimeEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env;

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv,
  emptyStringAsUndefined: true,
});
