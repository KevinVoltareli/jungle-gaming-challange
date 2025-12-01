import { ApiClient } from "./api-client";
import { AuthApiService } from "./auth-api.service";
import { TasksApiService } from "./tasks-api.service";
import { CommentsApiService } from "./comments-api.service";
import { useAuthStore } from "../store/auth.store";
import { UsersApiService } from "./users-api.service";

// Um único ApiClient, usando sempre o accessToken atual do store
const apiClient = new ApiClient({
  getAccessToken: () => useAuthStore.getState().tokens?.accessToken ?? null,
});

export const authApi = new AuthApiService(apiClient);
export const tasksApi = new TasksApiService(apiClient);
export const commentsApi = new CommentsApiService(apiClient);
export const usersApi = new UsersApiService(apiClient);

// Reexporta tipos e classes se precisar em outros lugares
export * from "./api-client";
export * from "./auth-api.service";
export * from "./tasks-api.service";
export * from "./comments-api.service";
export * from "./users-api.service";
