import { TaskId, UserId, TaskPriority, TaskStatus } from "../domain/task";

export interface BaseTaskEvent {
  taskId: TaskId;
  actorUserId: UserId;
  occurredAt: string;
}

export interface TaskCreatedEvent extends BaseTaskEvent {
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignees: UserId[];
}

export interface TaskUpdatedEvent extends BaseTaskEvent {
  changes: {
    field:
      | "title"
      | "description"
      | "dueDate"
      | "priority"
      | "status"
      | "assignees";
    oldValue: string | null;
    newValue: string | null;
  }[];
}

export interface TaskCommentCreatedEvent extends BaseTaskEvent {
  commentId: string;
  content: string;
}
