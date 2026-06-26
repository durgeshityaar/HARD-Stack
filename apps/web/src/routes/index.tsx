import { useQuery } from "@tanstack/react-query";
import { createRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  const trpc = useTRPC();
  const session = useSession();
  const health = useQuery(trpc.health.check.queryOptions({}));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hard Stack</h1>
        <p className="mt-2 text-slate-600">
          Hono · tRPC · Drizzle · Better Auth · TanStack · Tailwind v4
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 text-sm">
        <p>
          API health:{" "}
          <span className="font-mono">
            {health.data?.status ?? (health.isLoading ? "checking…" : "—")}
          </span>
        </p>
        <p className="mt-1 text-slate-600">
          {session.data ? `Signed in as ${session.data.user.email}` : "Not signed in"}
        </p>
      </div>

      <Link to="/posts" className={buttonVariants()}>
        Browse posts
      </Link>
    </div>
  );
}
