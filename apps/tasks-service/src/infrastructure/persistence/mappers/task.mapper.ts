import { Task } from "../../../domain/task/task.entity";
import { TaskTitle } from "../../../domain/task/value-objects/task-title.vo";
import { TaskDescription } from "../../../domain/task/value-objects/task-description.vo";
import { TaskPriority } from "../../../domain/task/task-priority-enum";
import { TaskStatus } from "../../../domain/task/task-status.enum";
import { TaskOrmEntity } from "../typeorm/entities/task.orm-entity";
import { TaskAssigneeMapper } from "./task-assignee.mapper";

export class TaskMapper {
  static toDomain(orm: TaskOrmEntity): Task {
    return Task.rehydrate({
      id: orm.id,
      title: TaskTitle.create(orm.title),
      description: TaskDescription.create(orm.description),
      priority: orm.priority as TaskPriority,
      status: orm.status as TaskStatus,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      dueDate: orm.dueDate,
      creatorId: orm.creatorId,

      assignees:
        orm.assignees?.map((a) => TaskAssigneeMapper.toDomain(a)) ?? [],

      comments: [],
      history: [],
    });
  }

  static toOrm(entity: Task): TaskOrmEntity {
    const orm = new TaskOrmEntity();
    orm.id = entity.id;
    orm.title = entity.title.value;
    orm.description = entity.description.value;
    orm.priority = entity.priority;
    orm.status = entity.status;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.dueDate = entity.dueDate ?? null;
    orm.creatorId = entity.creatorId;
    return orm;
  }

  static toHttp(entity: Task) {
    return {
      id: entity.id,
      title: entity.title.value,
      description: entity.description.value,
      priority: entity.priority,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      dueDate: entity.dueDate,
      creatorId: entity.creatorId,
      assignees:
        entity.assignees?.map((a) => ({
          userId: a.userId,
          assignedAt: a.assignedAt,
        })) ?? [],
    };
  }
}
