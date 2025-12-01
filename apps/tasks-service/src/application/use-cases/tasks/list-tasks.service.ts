import { Injectable, Inject } from "@nestjs/common";
import {
  ITaskRepository,
  TaskPaginationParams,
} from "../../../domain/task/task-repository.interface";
import { TaskStatus } from "../../../domain/task/task-status.enum";
import { TaskPriority } from "../../../domain/task/task-priority-enum";

export interface ListTasksInput {
  page: number;
  size: number;
  status?: TaskStatus;
  search?: string;
}

export interface ListTasksItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListTasksOutput {
  items: ListTasksItem[];
  total: number;
  page: number;
  size: number;
}

@Injectable()
export class ListTasksService {
  constructor(
    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(input: ListTasksInput): Promise<ListTasksOutput> {
    const page = input.page > 0 ? input.page : 1;
    const size = input.size > 0 ? input.size : 10;

    const params: TaskPaginationParams = {
      page,
      size,
      status: input.status,
      search: input.search,
    };

    const result = await this.taskRepository.findPaginated(params);

    return {
      items: result.items.map((task) => ({
        id: task.id,
        title: task.title.value,
        description: task.description.value,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        creatorId: task.creatorId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      total: result.total,
      page,
      size,
    };
  }
}
