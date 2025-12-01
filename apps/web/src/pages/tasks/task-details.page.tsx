// apps/web/src/pages/tasks/task-details.page.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { tasksApi, commentsApi } from "../../libs/api";
import { useUsers } from "../../libs/hooks/useUsers";
import { Button } from "../../shared/ui/button";
import { Textarea } from "../../shared/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/ui/card";
import { toast } from "../../shared/hooks/use-toast";
import type {
  TaskPriority,
  TaskStatus,
} from "../../libs/api/tasks-api.service";

interface CommentDto {
  id: string;
  content: string;
  createdAt: string;
  authorName?: string;
}

export function TaskDetailsPage() {
  const { taskId } = useParams({ from: "/app/tasks/$taskId" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ------- Task -------
  const taskQuery = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getTaskById(taskId),
  });

  // ------- Form local da task (edição) -------
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string; // YYYY-MM-DD
  }>({
    title: "",
    description: "",
    priority: "LOW",
    status: "TODO",
    dueDate: "",
  });

  // IDs dos usuários atualmente atribuídos à tarefa
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (taskQuery.data) {
      const t = taskQuery.data as any;

      setForm({
        title: t.title ?? "",
        description: (t.description as string) ?? "",
        priority: (t.priority ?? "LOW") as TaskPriority,
        status: (t.status ?? "TODO") as TaskStatus,
        dueDate: t.dueDate ? t.dueDate.substring(0, 10) : "",
      });

      // 👇 AQUI SINCRONIZA OS RESPONSÁVEIS COM O QUE VEIO DO BACKEND
      const assigneesIds: string[] = Array.isArray(t.assignees)
        ? t.assignees.map((a: any) => a.userId)
        : [];
      setSelectedUserIds(assigneesIds);
    }
  }, [taskQuery.data]);

  // ------- Comments -------
  const commentsQuery = useQuery<CommentDto[]>({
    queryKey: ["task", taskId, "comments"],
    queryFn: async () => {
      const res = await commentsApi.listTaskComments(taskId);
      // backend devolve paginado, pegamos só os items
      return res.items as CommentDto[];
    },
  });

  const [newComment, setNewComment] = useState("");

  const createCommentMutation = useMutation({
    mutationFn: (content: string) =>
      commentsApi.createComment(taskId, { content }),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["task", taskId, "comments"] });
    },
    onError: () => {
      toast.error("Não foi possível enviar o comentário.");
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment.trim());
  };

  // ------- Users (para atribuir) -------
  const { usersQuery } = useUsers();

  const toggleUser = (userId: string) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  const assignUsersMutation = useMutation({
    mutationFn: (userIds: string[]) => tasksApi.assignUsers(taskId, userIds),
    onSuccess: () => {
      toast.success("Responsáveis atualizados.");
      // recarrega a task pra atualizar lista de assignees
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
    onError: () => {
      toast.error("Não foi possível atribuir usuários à tarefa.");
    },
  });

  const handleAssignUsers = () => {
    if (selectedUserIds.length === 0) {
      toast.error("Selecione pelo menos um usuário.");
      return;
    }
    assignUsersMutation.mutate(selectedUserIds);
  };

  // ------- UPDATE / DELETE -------
  const updateTaskMutation = useMutation({
    mutationFn: () =>
      tasksApi.updateTask(taskId, {
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate
          ? new Date(form.dueDate).toISOString()
          : undefined,
      }),
    onSuccess: () => {
      toast.success("Tarefa atualizada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Não foi possível atualizar a tarefa.");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      toast.success("Tarefa removida.");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate({ to: "/app/tasks" as any });
    },
    onError: () => {
      toast.error("Não foi possível remover a tarefa.");
    },
  });

  // ------- Loading / error -------
  useEffect(() => {
    if (taskQuery.error) {
      console.error("Erro ao carregar tarefa:", taskQuery.error);
    }
  }, [taskQuery.error]);

  if (taskQuery.isLoading) {
    return <div className="p-4">Carregando tarefa...</div>;
  }

  if (taskQuery.isError || !taskQuery.data) {
    return (
      <div className="p-4">
        <p className="text-red-500">Erro ao carregar tarefa.</p>
      </div>
    );
  }

  const task: any = taskQuery.data;
  const comments: CommentDto[] = commentsQuery.data ?? [];

  // Helper pra mostrar chip bonitinho
  const renderAssigneesChips = () => {
    if (
      !usersQuery.data ||
      !Array.isArray(task.assignees) ||
      task.assignees.length === 0
    ) {
      return (
        <span className="text-xs text-slate-500">
          Nenhum responsável atribuído.
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {task.assignees.map((a: any) => {
          const user = usersQuery.data!.find((u) => u.id === a.userId);
          const label = user ? user.username : a.userId.slice(0, 6);

          return (
            <span
              key={a.userId}
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* CABEÇALHO + FORM DA TAREFA */}
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            className="w-full md:w-2/3 border rounded px-3 py-2 text-lg font-semibold"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => updateTaskMutation.mutate()}
              disabled={updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending
                ? "Salvando..."
                : "Salvar alterações"}
            </Button>

            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (
                  window.confirm("Tem certeza que deseja apagar esta tarefa?")
                ) {
                  deleteTaskMutation.mutate();
                }
              }}
              disabled={deleteTaskMutation.isPending}
            >
              {deleteTaskMutation.isPending ? "Removendo..." : "Excluir"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Textarea
            rows={3}
            placeholder="Descrição da tarefa"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />

          <div className="grid gap-4 sm:grid-cols-4 text-xs text-slate-600">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Status</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as TaskStatus,
                  }))
                }
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold">Prioridade</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as TaskPriority,
                  }))
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold">Prazo</span>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>

            {/* 👇 NOVO BLOCO: QUEM ESTÁ ATRIBUÍDO */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Responsáveis</span>
              {renderAssigneesChips()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COMENTÁRIOS + NOVO COMENTÁRIO + ATRIBUIÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de comentários */}
        <Card>
          <CardHeader>
            <CardTitle>Comentários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum comentário ainda.</p>
            )}

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-md bg-slate-50 px-3 py-2 text-sm"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-xs">
                    {comment.authorName ?? "Usuário"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comment.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{comment.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Novo comentário + atribuição */}
        <div className="space-y-6">
          {/* Novo comentário */}
          <Card>
            <CardHeader>
              <CardTitle>Novo comentário</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleSubmitComment}>
                <Textarea
                  rows={4}
                  placeholder="Escreva um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={createCommentMutation.isPending}
                >
                  {createCommentMutation.isPending
                    ? "Enviando..."
                    : "Enviar comentário"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Atribuir usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Atribuir usuários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {usersQuery.isLoading && (
                <p className="text-sm text-slate-500">Carregando usuários...</p>
              )}

              {usersQuery.isError && (
                <p className="text-sm text-red-500">
                  Erro ao carregar usuários.
                </p>
              )}

              {usersQuery.data && usersQuery.data.length === 0 && (
                <p className="text-sm text-slate-500">
                  Nenhum usuário encontrado.
                </p>
              )}

              {usersQuery.data && usersQuery.data.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto border rounded-md px-3 py-2">
                  {usersQuery.data.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                      />
                      <span>
                        {user.username}{" "}
                        <span className="text-xs text-slate-500">
                          ({user.email})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <Button
                type="button"
                onClick={handleAssignUsers}
                disabled={
                  assignUsersMutation.isPending ||
                  !usersQuery.data ||
                  usersQuery.data.length === 0
                }
              >
                {assignUsersMutation.isPending
                  ? "Salvando..."
                  : "Atualizar responsáveis"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
