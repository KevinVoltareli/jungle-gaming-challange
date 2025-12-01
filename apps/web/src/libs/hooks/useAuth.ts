// apps/web/src/libs/hooks/useAuth.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponseDto,
} from "../api";
import { ApiError } from "../api/api-client";
import { useAuthStore } from "../store/auth.store";
import { toast } from "../../shared/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { login: loginStore, logout: logoutStore, status } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (result: AuthResponseDto) => {
      // aqui o result JÁ tá no formato bonito do DTO
      loginStore({
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          roles: result.user.roles,
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });

      toast.success("Login realizado com sucesso!");
    },
    onError: (error: unknown) => {
      console.error("Erro no login", error);

      // Pega status & message de forma defensiva
      const anyErr = error as any;

      const status: number | undefined =
        typeof anyErr?.status === "number"
          ? anyErr.status
          : typeof anyErr?.data?.statusCode === "number"
            ? anyErr.data.statusCode
            : undefined;

      const messageFromBody: string | undefined =
        typeof anyErr?.data?.message === "string"
          ? anyErr.data.message
          : undefined;

      // Trata 401 mesmo que o HTTP original venha 500
      if (status === 401 || messageFromBody === "Invalid credentials") {
        toast.error("Usuário ou senha inválidos");
        return;
      }

      // fallback
      toast.error("Erro inesperado ao fazer login. Tente novamente.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: (result: AuthResponseDto) => {
      loginStore({
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          roles: result.user.roles,
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });

      toast.success("Conta criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro no registro", error);
      toast.error("Não foi possível criar a conta.");
    },
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutate,
    loginStatus: loginMutation.status,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerStatus: registerMutation.status,
    registerError: registerMutation.error,
    isAuthenticated: status === "authenticated",
    logout,
  };
}
