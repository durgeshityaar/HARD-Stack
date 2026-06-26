import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4">
          <Link to="/" className="font-semibold">
            Hard Stack
          </Link>
          <Link to="/posts" className="text-slate-600 hover:text-slate-900">
            Posts
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
