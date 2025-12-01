import { useEffect } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/ui/card";
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { useAuth } from "../../libs/hooks/useAuth";
// REMOVE o import do toast daqui

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Informe e-mail ou nome de usuário"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const { login, loginStatus, isAuthenticated } = useAuth(); // tira o loginError daqui

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: "/app/tasks" });
    }
  }, [isAuthenticated, router]);

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  const isSubmitting = loginStatus === "pending";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                E-mail
              </label>
              <Input
                type="email"
                autoComplete="email"
                {...register("emailOrUsername")}
              />
              {errors.emailOrUsername && (
                <p className="text-xs text-red-500">
                  {errors.emailOrUsername.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Não tem conta?{" "}
              <Link
                to="/register"
                className="font-medium text-slate-900 hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
