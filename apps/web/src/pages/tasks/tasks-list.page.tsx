import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTasks } from "../../libs/hooks/useTasks";
import { useWebSocketNotifications } from "../../libs/hooks/useWebSocketNotifications";
import { Button } from "../../shared/ui/button";
import type { TaskDto } from "../../libs/api/tasks-api.service";

export function TasksListPage() {
  const navigate = useNavigate();
  const { tasksQuery } = useTasks({ page: 1, size: 20 });

  useWebSocketNotifications();

  const tasks: TaskDto[] = tasksQuery.data?.items ?? [];
  const total = tasksQuery.data?.total ?? tasks.length;

  useEffect(() => {
    if (tasksQuery.error) {
      console.error("Erro ao carregar tarefas:", tasksQuery.error);
    }
  }, [tasksQuery.error]);

  if (tasksQuery.isLoading) {
    return <div className="p-4">Carregando tarefas...</div>;
  }

  if (tasksQuery.isError) {
    return (
      <div className="p-4 space-y-2">
        <p className="text-red-500">
          Erro ao carregar tarefas. Tente novamente.
        </p>
        <Button onClick={() => tasksQuery.refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Tarefas ({total})</h1>

        <Button onClick={() => navigate({ to: "/app/tasks/create" as any })}>
          Novo Task (TODO)
        </Button>
      </div>

      <div className="border rounded-lg divide-y bg-white">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            className="w-full text-left p-3 flex justify-between hover:bg-slate-50 focus:outline-none"
            onClick={() =>
              navigate({
                to: "/app/tasks/$taskId",
                params: { taskId: task.id },
              })
            }
          >
            <div>
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <div className="text-xs text-slate-500">{task.description}</div>
              )}
            </div>
            <div className="text-xs text-slate-500">{task.status}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
