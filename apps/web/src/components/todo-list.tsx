import { Button, Input } from "@hard-stack/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const todos = useQuery(trpc.todo.all.queryOptions({}));

  const invalidate = () => queryClient.invalidateQueries(trpc.todo.all.queryFilter());

  const createTodo = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        setTitle("");
        return invalidate();
      },
    }),
  );
  const updateTodo = useMutation(trpc.todo.update.mutationOptions({ onSuccess: invalidate }));
  const deleteTodo = useMutation(trpc.todo.delete.mutationOptions({ onSuccess: invalidate }));

  function add() {
    const trimmed = title.trim();
    if (!trimmed) return;
    createTodo.mutate({ title: trimmed });
  }

  const items = todos.data ?? [];
  const remaining = items.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="flex gap-2"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo"
        />
        <Button type="submit" disabled={createTodo.isPending || !title.trim()}>
          {createTodo.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
          Add
        </Button>
      </form>

      {todos.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : todos.error ? (
        <p className="py-10 text-center text-sm text-destructive">
          Failed to load todos: {todos.error.message}
        </p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nothing here yet — add your first todo above.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {items.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={(t) => updateTodo.mutate({ id: t.id, completed: !t.completed })}
                onDelete={(id) => deleteTodo.mutate({ id })}
                toggling={updateTodo.isPending && updateTodo.variables?.id === todo.id}
                deleting={deleteTodo.isPending && deleteTodo.variables?.id === todo.id}
              />
            ))}
          </ul>
          <p className="text-center text-xs text-muted-foreground">
            {remaining} {remaining === 1 ? "item" : "items"} left
          </p>
        </>
      )}
    </div>
  );
}
