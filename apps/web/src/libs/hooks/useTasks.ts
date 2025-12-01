import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tasksApi,
  type TaskDto,
  type CreateTaskRequest,
  type UpdateTaskRequest,
} from "../../libs/api";
import { type PaginatedResponse } from "../../libs/api/types";

type UseTasksParams = {
  page?: number;
  size?: number;
};

export function useTasks(params: UseTasksParams = {}) {
  const queryClient = useQueryClient();
  const { page = 1, size = 10 } = params;

  // Lista de tarefas com paginação
  const tasksQuery = useQuery<PaginatedResponse<TaskDto>>({
    queryKey: ["tasks", { page, size }],
    queryFn: () => tasksApi.listTasks({ page, size }),
  });

  // Criar tarefa
  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskRequest) => tasksApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Atualizar tarefa
  const updateTaskMutation = useMutation({
    mutationFn: (input: { taskId: string; payload: UpdateTaskRequest }) =>
      tasksApi.updateTask(input.taskId, input.payload),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  // Deletar tarefa
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasksQuery, // { data, isLoading, error, ... }

    createTask: createTaskMutation.mutate,
    createTaskStatus: createTaskMutation.status,
    createTaskError: createTaskMutation.error,

    updateTask: updateTaskMutation.mutate,
    updateTaskStatus: updateTaskMutation.status,
    updateTaskError: updateTaskMutation.error,

    deleteTask: deleteTaskMutation.mutate,
    deleteTaskStatus: deleteTaskMutation.status,
    deleteTaskError: deleteTaskMutation.error,
  };
}

// Hook separado para detalhes de uma tarefa específica (opcional, mas útil)
export function useTaskDetails(taskId: string | undefined) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getTaskById(taskId as string),
    enabled: !!taskId,
  });
}
