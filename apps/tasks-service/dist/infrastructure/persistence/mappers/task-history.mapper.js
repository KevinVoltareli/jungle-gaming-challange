"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskHistoryMapper = void 0;
const task_history_entity_1 = require("../../../domain/task/task-history.entity");
const task_history_orm_entity_1 = require("../typeorm/entities/task-history.orm-entity");
class TaskHistoryMapper {
    static toDomain(entity) {
        return task_history_entity_1.TaskHistory.rehydrate({
            id: entity.id,
            taskId: entity.taskId,
            field: entity.field,
            oldValue: entity.oldValue,
            newValue: entity.newValue,
            changedByUserId: entity.changedByUserId,
            changedAt: entity.changedAt,
        });
    }
    static toOrm(history) {
        const orm = new task_history_orm_entity_1.TaskHistoryOrmEntity();
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
exports.TaskHistoryMapper = TaskHistoryMapper;
//# sourceMappingURL=task-history.mapper.js.map