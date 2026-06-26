import { authRouter } from "./routers/auth";
import { healthRouter } from "./routers/health";
import { postRouter } from "./routers/post";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
