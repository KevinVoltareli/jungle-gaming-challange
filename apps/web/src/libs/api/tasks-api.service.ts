import { ApiClient } from "./api-client";
import type { PaginatedResponse } from "./types";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface TaskDto {
  id: string;
  title: string;
  description?: string | null; // aceita null e undefined
  status: string; // "TODO" | "IN_PROGRESS" | ... se quiser afinar depois
  priority: string; // "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  assignees?: TaskAssigneeDto[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  assigneeIds?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeIds?: string[];
}

export interface TaskAssigneeDto {
  userId: string;
  assignedAt: string;
}

export class TasksApiService {
  constructor(private readonly client: ApiClient) {}

  listTasks(params: { page?: number; size?: number } = {}) {
    const { page = 1, size = 10 } = params;

    return this.client.get<PaginatedResponse<TaskDto>>("api/tasks", {
      query: { page, size },
    });
  }

  getTaskById(taskId: string) {
    return this.client.get<TaskDto>(`api/tasks/${taskId}`);
  }

  createTask(payload: CreateTaskRequest) {
    return this.client.post<TaskDto>("api/tasks", {
      body: payload,
    });
  }

  updateTask(taskId: string, payload: UpdateTaskRequest) {
    return this.client.put<TaskDto>(`api/tasks/${taskId}`, {
      body: payload,
    });
  }

  deleteTask(taskId: string) {
    return this.client.delete<void>(`api/tasks/${taskId}`);
  }

  assignUsers(taskId: string, userIds: string[]) {
    return this.client.post<void>(`api/tasks/${taskId}/assign`, {
      body: { userIds },
    });
  }
}
