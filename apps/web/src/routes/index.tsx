import { Button } from "@hard-stack/ui";
import { createRoute } from "@tanstack/react-router";
import { Loader2, LogOut } from "lucide-react";
import { AuthCard } from "@/components/auth-card";
import { TodoList } from "@/components/todo-list";
import { signOut, useSession } from "@/lib/auth";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  const session = useSession();

  if (session.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <AuthCard />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Todos</h1>
          <p className="truncate text-sm text-muted-foreground">{session.data.user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void signOut()}>
          <LogOut />
          Sign out
        </Button>
      </header>
      <TodoList />
    </div>
  );
}
