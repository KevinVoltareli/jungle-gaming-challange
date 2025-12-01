import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { tasksApi } from "../../libs/api";
import { useUsers } from "../../libs/hooks/useUsers";
import { useAuthStore } from "../../libs/store/auth.store";

import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Textarea } from "../../shared/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/ui/card";
import { toast } from "../../shared/hooks/use-toast";

// --- schema do form ---
const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(), // yyyy-mm-dd do input[type=date]
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export function TaskCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // usuário logado (pra pegar creatorId)
  const currentUser = useAuthStore((s) => s.user);

  // lista de usuários pra atribuir
  const { usersQuery } = useUsers();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
      dueDate: "",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (values: CreateTaskFormValues) => {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // monta payload igual ao do Insomnia
      const payload = {
        title: values.title,
        description: values.description ?? "",
        priority: values.priority,
        creatorId: currentUser.id, // 👈 daqui vem o creatorId
        dueDate: values.dueDate
          ? new Date(values.dueDate).toISOString()
          : undefined,
        assigneeUserIds: selectedUserIds, // 👈 aqui vão os responsáveis
      };

      return tasksApi.createTask(payload);
    },
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!");
      // refaz a lista de tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate({ to: "/app/tasks" });
    },
    onError: (error) => {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Não foi possível criar a tarefa. Tente novamente.");
    },
  });

  const onSubmit = (values: CreateTaskFormValues) => {
    createTaskMutation.mutate(values);
  };

  const isSubmitting = createTaskMutation.isPending;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar nova tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Título */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Título
              </label>
              <Input type="text" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Descrição
              </label>
              <Textarea rows={3} {...register("description")} />
            </div>

            {/* Prioridade + Prazo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Prioridade
                </label>
                <select
                  className="border rounded-md px-2 py-1 text-sm w-full"
                  {...register("priority")}
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Prazo
                </label>
                <Input type="date" {...register("dueDate")} />
              </div>
            </div>

            {/* Assignees */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Atribuir usuários
              </label>

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
                <div className="space-y-1 max-h-40 overflow-y-auto border rounded-md px-3 py-2 bg-white">
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
            </div>

            <div className="pt-2 flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar tarefa"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/app/tasks" })}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
