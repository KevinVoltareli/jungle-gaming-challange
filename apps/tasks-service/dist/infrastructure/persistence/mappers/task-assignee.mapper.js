"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssigneeMapper = void 0;
// apps/tasks-service/src/infrastructure/persistence/mappers/task-assignee.mapper.ts
const task_assignee_entity_1 = require("../../../domain/task/task-assignee.entity");
const task_assignee_orm_entity_1 = require("../typeorm/entities/task-assignee.orm-entity");
class TaskAssigneeMapper {
    static toDomain(orm) {
        return task_assignee_entity_1.TaskAssignee.rehydrate({
            id: orm.id,
            taskId: orm.taskId,
            userId: orm.userId,
            // se no futuro o rehydrate aceitar createdAt, a gente volta e adiciona aqui
        });
    }
    static toOrm(entity) {
        const orm = new task_assignee_orm_entity_1.TaskAssigneeOrmEntity();
        orm.id = entity.id;
        orm.taskId = entity.taskId;
        orm.userId = entity.userId;
        // se TaskAssigneeOrmEntity tiver createdAt:
        // @ts-ignore se o TS reclamar, mas em geral vai existir na entity
        orm.createdAt = entity.createdAt ?? new Date();
        return orm;
    }
}
exports.TaskAssigneeMapper = TaskAssigneeMapper;
//# sourceMappingURL=task-assignee.mapper.js.map