import { useQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useTRPC } from "@/lib/trpc";
import { rootRoute } from "./__root";

export const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts",
  component: PostsPage,
});

function PostsPage() {
  const trpc = useTRPC();
  const posts = useQuery(trpc.post.all.queryOptions({}));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Posts</h1>

      {posts.isLoading && <p className="text-slate-600">Loading…</p>}
      {posts.error && <p className="text-red-600">Failed to load: {posts.error.message}</p>}

      {posts.data?.length === 0 && <p className="text-slate-600">No posts yet.</p>}

      <ul className="space-y-3">
        {posts.data?.map((post) => (
          <li key={post.id} className="rounded-lg border border-slate-200 p-4">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
