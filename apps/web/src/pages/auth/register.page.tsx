import { useEffect } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/ui/card";
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { useAuth } from "../../libs/hooks/useAuth";
import { toast } from "../../shared/hooks/use-toast";

const registerSchema = z.object({
  username: z.string().min(2, "Nome de usuário muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const router = useRouter();
  const {
    register: registerUser,
    registerStatus,
    registerError,
    isAuthenticated,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: "/app/tasks" });
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (registerError) {
      toast.error(
        (registerError as any)?.message ??
          "Falha ao criar conta. Tente novamente."
      );
    }
  }, [registerError]);

  const onSubmit = (values: RegisterFormValues) => {
    registerUser(values);
  };

  const isSubmitting = registerStatus === "pending";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Usuário
              </label>
              <Input autoComplete="username" {...register("username")} />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                E-mail
              </label>
              <Input type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <Input
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Já tem conta?{" "}
              <Link
                to="/login"
                className="font-medium text-slate-900 hover:underline"
              >
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
