// apps/tasks-service/src/infrastructure/persistence/mappers/task-assignee.mapper.ts
import { TaskAssignee } from "../../../domain/task/task-assignee.entity";
import { TaskAssigneeOrmEntity } from "../typeorm/entities/task-assignee.orm-entity";

export class TaskAssigneeMapper {
  static toDomain(orm: TaskAssigneeOrmEntity): TaskAssignee {
    return TaskAssignee.rehydrate({
      id: orm.id,
      taskId: orm.taskId,
      userId: orm.userId,
      // se no futuro o rehydrate aceitar createdAt, a gente volta e adiciona aqui
    });
  }

  static toOrm(entity: TaskAssignee): TaskAssigneeOrmEntity {
    const orm = new TaskAssigneeOrmEntity();
    orm.id = entity.id;
    orm.taskId = entity.taskId;
    orm.userId = entity.userId;
    // se TaskAssigneeOrmEntity tiver createdAt:
    // @ts-ignore se o TS reclamar, mas em geral vai existir na entity
    (orm as any).createdAt = (entity as any).createdAt ?? new Date();
    return orm;
  }
}
