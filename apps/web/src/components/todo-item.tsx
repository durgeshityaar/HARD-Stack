import { Button, Checkbox, cn } from "@hard-stack/ui";
import { Loader2, Trash2 } from "lucide-react";
import type { Todo } from "@/lib/trpc";

type TodoItemProps = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  toggling?: boolean;
  deleting?: boolean;
};

export function TodoItem({ todo, onToggle, onDelete, toggling, deleting }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-accent/50">
      <Checkbox
        checked={todo.completed}
        disabled={toggling}
        onCheckedChange={() => onToggle(todo)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
      />
      <span
        className={cn(
          "flex-1 text-sm leading-none",
          todo.completed && "text-muted-foreground line-through",
        )}
      >
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-destructive"
        disabled={deleting}
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
      >
        {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
      </Button>
    </li>
  );
}
