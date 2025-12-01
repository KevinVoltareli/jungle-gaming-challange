import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";

export interface TaskPaginationParams {
  page: number;
  size: number;
  status?: TaskStatus;
  search?: string;
}

export interface TaskPaginationResult {
  items: Task[];
  total: number;
  page: number;
  size: number;
}

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  save(task: Task): Promise<void>;
  findPaginated(params: TaskPaginationParams): Promise<TaskPaginationResult>;
  findByStatus(status: TaskStatus): Promise<Task[]>;
  delete(id: string): Promise<void>;
}
