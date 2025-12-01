import {
  TaskHistory,
  TaskHistoryField,
} from "../../../domain/task/task-history.entity";

import { TaskHistoryOrmEntity } from "../typeorm/entities/task-history.orm-entity";

export class TaskHistoryMapper {
  static toDomain(entity: TaskHistoryOrmEntity): TaskHistory {
    return TaskHistory.rehydrate({
      id: entity.id,
      taskId: entity.taskId,
      field: entity.field as TaskHistoryField,
      oldValue: entity.oldValue,
      newValue: entity.newValue,
      changedByUserId: entity.changedByUserId,
      changedAt: entity.changedAt,
    });
  }

  static toOrm(history: TaskHistory): TaskHistoryOrmEntity {
    const orm = new TaskHistoryOrmEntity();

    orm.id = history.id;
    orm.taskId = history.taskId;
    orm.field = history.field;
    orm.oldValue = history.oldValue;
    orm.newValue = history.newValue;
    orm.changedByUserId = history.changedByUserId;
    orm.changedAt = history.changedAt;

    return orm;
  }
}
