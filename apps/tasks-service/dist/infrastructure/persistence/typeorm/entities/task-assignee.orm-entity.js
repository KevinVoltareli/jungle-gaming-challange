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
exports.TaskAssigneeOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const task_orm_entity_1 = require("./task.orm-entity");
let TaskAssigneeOrmEntity = class TaskAssigneeOrmEntity {
};
exports.TaskAssigneeOrmEntity = TaskAssigneeOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskAssigneeOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_id' }),
    __metadata("design:type", String)
], TaskAssigneeOrmEntity.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_orm_entity_1.TaskOrmEntity, (task) => task.assignees, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_orm_entity_1.TaskOrmEntity)
], TaskAssigneeOrmEntity.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], TaskAssigneeOrmEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'assigned_at' }),
    __metadata("design:type", Date)
], TaskAssigneeOrmEntity.prototype, "assignedAt", void 0);
exports.TaskAssigneeOrmEntity = TaskAssigneeOrmEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'task_assignees' })
], TaskAssigneeOrmEntity);
//# sourceMappingURL=task-assignee.orm-entity.js.map