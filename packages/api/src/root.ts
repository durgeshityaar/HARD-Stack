import { authRouter } from "./routers/auth";
import { healthRouter } from "./routers/health";
import { todoRouter } from "./routers/todo";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
