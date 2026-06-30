import type { AppRouter } from "@hard-stack/api";
import { env } from "@hard-stack/env/client";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

/** React context + `useTRPC()` hook, typed against the server's AppRouter. */
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

/** Inferred API response types, so the UI stays in sync with the router. */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Todo = RouterOutputs["todo"]["all"][number];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.VITE_SERVER_URL}/trpc`,
      transformer: superjson,
      fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
    }),
  ],
});
