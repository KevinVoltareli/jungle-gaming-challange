"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMapper = void 0;
const task_entity_1 = require("../../../domain/task/task.entity");
const task_title_vo_1 = require("../../../domain/task/value-objects/task-title.vo");
const task_description_vo_1 = require("../../../domain/task/value-objects/task-description.vo");
const task_orm_entity_1 = require("../typeorm/entities/task.orm-entity");
const task_assignee_mapper_1 = require("./task-assignee.mapper");
class TaskMapper {
    static toDomain(orm) {
        return task_entity_1.Task.rehydrate({
            id: orm.id,
            title: task_title_vo_1.TaskTitle.create(orm.title),
            description: task_description_vo_1.TaskDescription.create(orm.description),
            priority: orm.priority,
            status: orm.status,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
            dueDate: orm.dueDate,
            creatorId: orm.creatorId,
            assignees: orm.assignees?.map((a) => task_assignee_mapper_1.TaskAssigneeMapper.toDomain(a)) ?? [],
            comments: [],
            history: [],
        });
    }
    static toOrm(entity) {
        const orm = new task_orm_entity_1.TaskOrmEntity();
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
    static toHttp(entity) {
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
            assignees: entity.assignees?.map((a) => ({
                userId: a.userId,
                assignedAt: a.assignedAt,
            })) ?? [],
        };
    }
}
exports.TaskMapper = TaskMapper;
//# sourceMappingURL=task.mapper.js.map