import { TaskPriority } from "../../../domain/task/task-priority-enum";
import { TaskStatus } from "../../../domain/task/task-status.enum";

// nomes dos eventos no RabbitMQ
export const TASK_CREATED_EVENT = "task.created";
export const TASK_UPDATED_EVENT = "task.updated";
export const TASK_COMMENT_CREATED_EVENT = "task.comment.created";

export interface TaskCreatedEventPayload {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: string;
  assigneeUserIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskUpdatedEventPayload {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  updatedAt: string;
  changedByUserId: string;
}

export interface TaskCommentCreatedEventPayload {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}
