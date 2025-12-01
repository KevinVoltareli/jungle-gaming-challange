"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const task_priority_enum_1 = require("../../../../domain/task/task-priority-enum");
const task_status_enum_1 = require("../../../../domain/task/task-status.enum");
const comment_orm_entity_1 = require("./comment.orm-entity");
const task_history_orm_entity_1 = require("./task-history.orm-entity");
const task_assignee_orm_entity_1 = require("./task-assignee.orm-entity");
let TaskOrmEntity = class TaskOrmEntity {
};
exports.TaskOrmEntity = TaskOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TaskOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskOrmEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], TaskOrmEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "due_date", type: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], TaskOrmEntity.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], TaskOrmEntity.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], TaskOrmEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "creator_id" }),
    __metadata("design:type", String)
], TaskOrmEntity.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_orm_entity_1.CommentOrmEntity, (comment) => comment.task, {
        cascade: false,
    }),
    __metadata("design:type", Array)
], TaskOrmEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_history_orm_entity_1.TaskHistoryOrmEntity, (history) => history.task, {
        cascade: false,
    }),
    __metadata("design:type", Array)
], TaskOrmEntity.prototype, "history", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_assignee_orm_entity_1.TaskAssigneeOrmEntity, (assignee) => assignee.task, {
        cascade: false,
    }),
    __metadata("design:type", Array)
], TaskOrmEntity.prototype, "assignees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], TaskOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], TaskOrmEntity.prototype, "updatedAt", void 0);
exports.TaskOrmEntity = TaskOrmEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "tasks" })
], TaskOrmEntity);
//# sourceMappingURL=task.orm-entity.js.map