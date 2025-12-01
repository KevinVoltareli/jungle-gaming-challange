// apps/web/src/libs/store/auth.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  roles?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /**
   * Timestamp em milissegundos (Date.now()) de quando o accessToken expira.
   * Quando conectarmos com o backend, podemos preencher isso com o "exp" do JWT.
   */
  accessTokenExpiresAt?: number;
}

type AuthStateCore = {
  status: AuthStatus;
  user: AuthUser | null;
  tokens: AuthTokens | null;
};

type AuthActions = {
  /**
   * Faz login: seta usuário + tokens e marca status como autenticado.
   */
  login: (payload: { user: AuthUser; tokens: AuthTokens }) => void;

  /**
   * Faz logout completo: limpa user e tokens e marca como não autenticado.
   */
  logout: () => void;

  /**
   * Atualiza apenas os tokens (usado no refresh).
   */
  setTokens: (tokens: AuthTokens | null) => void;

  /**
   * Alias de login usado pelos hooks (seta user + tokens).
   */
  setAuth: (user: AuthUser, tokens: AuthTokens) => void;

  /**
   * Alias de logout usado pelos hooks (limpa user + tokens).
   */
  clearAuth: () => void;

  /**
   * Indica se o accessToken está expirado considerando o accessTokenExpiresAt.
   */
  isAccessTokenExpired: () => boolean;

  /**
   * Indica se vale a pena tentar o refresh (falta pouco pra expirar).
   */
  shouldAttemptRefresh: () => boolean;
};

export type AuthState = AuthStateCore & AuthActions;

const initialCoreState: AuthStateCore = {
  status: "idle",
  user: null,
  tokens: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialCoreState,

      // ação principal de login
      login: ({ user, tokens }) =>
        set(() => ({
          status: "authenticated",
          user,
          tokens,
        })),

      // ação principal de logout
      logout: () =>
        set(() => ({
          status: "unauthenticated",
          user: null,
          tokens: null,
        })),

      // alias de login pra usar em hooks (login programático)
      setAuth: (user, tokens) =>
        set(() => ({
          status: "authenticated",
          user,
          tokens,
        })),

      // alias de logout pra usar em hooks
      clearAuth: () =>
        set(() => ({
          status: "unauthenticated",
          user: null,
          tokens: null,
        })),

      setTokens: (tokens) =>
        set((state) => ({
          ...state,
          tokens,
        })),

      isAccessTokenExpired: () => {
        const tokens = get().tokens;
        if (!tokens?.accessTokenExpiresAt) return false;
        return Date.now() >= tokens.accessTokenExpiresAt;
      },

      shouldAttemptRefresh: () => {
        const tokens = get().tokens;
        if (!tokens?.accessTokenExpiresAt || !tokens.refreshToken) return false;

        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        // Se faltar 5min ou menos pro token expirar, já consideramos que deve tentar refresh.
        return tokens.accessTokenExpiresAt - now <= fiveMinutes;
      },
    }),
    {
      name: "auth-store",
      /**
       * Só persiste o que for necessário.
       * Funções (login/logout/etc.) não são serializadas.
       */
      partialize: (state) => ({
        status: state.status,
        user: state.user,
        tokens: state.tokens,
      }),
    }
  )
);
