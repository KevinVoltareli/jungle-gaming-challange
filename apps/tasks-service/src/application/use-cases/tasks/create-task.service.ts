import { Inject, Injectable } from "@nestjs/common";

import { ITaskRepository } from "../../../domain/task/task-repository.interface";
import { ITaskAssigneeRepository } from "../../../domain/task/task-assignee-repository.interface";

import { TaskTitle } from "../../../domain/task/value-objects/task-title.vo";
import { TaskDescription } from "../../../domain/task/value-objects/task-description.vo";
import { TaskPriority } from "../../../domain/task/task-priority-enum";
import { TaskStatus } from "../../../domain/task/task-status.enum";
import { Task } from "../../../domain/task/task.entity";
import { TaskAssignee } from "../../../domain/task/task-assignee.entity";

import { IIdGenerator } from "../../ports/id-generator.interface";
import { IEventPublisher } from "../../ports/event-publisher.interface";
import {
  TASK_CREATED_EVENT,
  TaskCreatedEventPayload,
} from "../../events/tasks/task-events";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  creatorId: string;
  assigneeUserIds?: string[];
}

@Injectable()
export class CreateTaskService {
  constructor(
    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository,

    @Inject("ITaskAssigneeRepository")
    private readonly assigneeRepository: ITaskAssigneeRepository,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator,

    @Inject("IEventPublisher")
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(input: CreateTaskInput): Promise<{ id: string }> {
    const id = this.idGenerator.generate();
    const now = new Date();

    const title = TaskTitle.create(input.title);
    const description = TaskDescription.create(input.description ?? null);

    let dueDate: Date | null = null;
    if (input.dueDate) {
      const parsed = new Date(input.dueDate);
      if (!Number.isNaN(parsed.getTime())) {
        dueDate = parsed;
      }
    }

    // cria a task de domínio (note o creatorId, não creatorUserId)
    const task = Task.createNew({
      id,
      title,
      description,
      priority: input.priority ?? TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      creatorId: input.creatorId,
      dueDate,
    });

    // assignees
    const assignees: TaskAssignee[] =
      input.assigneeUserIds?.map((userId) =>
        TaskAssignee.createNew({
          id: this.idGenerator.generate(),
          taskId: task.id,
          userId,
        })
      ) ?? [];

    await this.taskRepository.save(task);

    if (assignees.length > 0) {
      await this.assigneeRepository.replaceAssignees(task.id, assignees);
    }

    const payload: TaskCreatedEventPayload = {
      id: task.id,
      title: task.title.value,
      description: task.description.value,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      creatorId: input.creatorId,
      assigneeUserIds: assignees.map((a) => a.userId),
    };

    await this.eventPublisher.publish(TASK_CREATED_EVENT, payload);

    return { id: task.id };
  }
}
