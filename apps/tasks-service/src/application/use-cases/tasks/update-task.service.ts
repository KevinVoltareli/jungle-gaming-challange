import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITaskRepository } from "../../../domain/task/task-repository.interface";
import { TaskPriority } from "../../../domain/task/task-priority-enum";
import { TaskStatus } from "../../../domain/task/task-status.enum";
import { TaskTitle } from "../../../domain/task/value-objects/task-title.vo";
import { TaskDescription } from "../../../domain/task/value-objects/task-description.vo";
import { ITaskHistoryRepository } from "../../../domain/task/task-history-repository.interface";
import { TaskHistory } from "../../../domain/task/task-history.entity";
import { IIdGenerator } from "../../ports/id-generator.interface";
import { IEventPublisher } from "../../ports/event-publisher.interface";
import {
  TASK_UPDATED_EVENT,
  TaskUpdatedEventPayload,
} from "../../events/tasks/task-events";

export interface UpdateTaskInput {
  taskId: string;
  actorUserId: string;
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
}

@Injectable()
export class UpdateTaskService {
  constructor(
    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository,

    @Inject("ITaskHistoryRepository")
    private readonly taskHistoryRepository: ITaskHistoryRepository,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator,

    @Inject("IEventPublisher")
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(input: UpdateTaskInput): Promise<void> {
    const task = await this.taskRepository.findById(input.taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    // 🔹 título
    if (input.title !== undefined) {
      const newTitle = TaskTitle.create(input.title);
      const history = task.changeTitle(newTitle, input.actorUserId);

      await this.taskHistoryRepository.save(
        TaskHistory.rehydrate({
          id: this.idGenerator.generate(),
          taskId: history.taskId,
          field: history.field,
          oldValue: history.oldValue,
          newValue: history.newValue,
          changedByUserId: history.changedByUserId,
        })
      );
    }

    // 🔹 descrição
    if (input.description !== undefined) {
      const newDesc = TaskDescription.create(input.description ?? null);
      const history = task.changeDescription(newDesc, input.actorUserId);

      await this.taskHistoryRepository.save(
        TaskHistory.rehydrate({
          id: this.idGenerator.generate(),
          taskId: history.taskId,
          field: history.field,
          oldValue: history.oldValue,
          newValue: history.newValue,
          changedByUserId: history.changedByUserId,
        })
      );
    }

    // 🔹 prioridade
    if (input.priority !== undefined) {
      const history = task.changePriority(input.priority, input.actorUserId);

      await this.taskHistoryRepository.save(
        TaskHistory.rehydrate({
          id: this.idGenerator.generate(),
          taskId: history.taskId,
          field: history.field,
          oldValue: history.oldValue,
          newValue: history.newValue,
          changedByUserId: history.changedByUserId,
        })
      );
    }

    // 🔹 status
    if (input.status !== undefined) {
      const history = task.changeStatus(input.status, input.actorUserId);

      await this.taskHistoryRepository.save(
        TaskHistory.rehydrate({
          id: this.idGenerator.generate(),
          taskId: history.taskId,
          field: history.field,
          oldValue: history.oldValue,
          newValue: history.newValue,
          changedByUserId: history.changedByUserId,
        })
      );
    }

    // 🔹 dueDate
    if (input.dueDate !== undefined) {
      let dueDate: Date | null = null;

      if (input.dueDate) {
        const parsed = new Date(input.dueDate);
        if (!Number.isNaN(parsed.getTime())) {
          dueDate = parsed;
        }
      }

      const oldValue = task.dueDate ? task.dueDate.toISOString() : "";
      const newValue = dueDate ? dueDate.toISOString() : "";

      (task as any)._dueDate = dueDate;

      const history = TaskHistory.forFieldChange({
        id: this.idGenerator.generate(),
        taskId: task.id,
        field: "dueDate",
        oldValue,
        newValue,
        changedByUserId: input.actorUserId,
      });

      await this.taskHistoryRepository.save(history);
    }

    await this.taskRepository.save(task);

    const payload: TaskUpdatedEventPayload = {
      id: task.id,
      title: task.title.value,
      description: task.description.value,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      priority: task.priority,
      status: task.status,
      updatedAt: task.updatedAt.toISOString(),
      changedByUserId: input.actorUserId,
    };

    await this.eventPublisher.publish(TASK_UPDATED_EVENT, payload);
  }
}
