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
exports.TaskHistoryOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const task_orm_entity_1 = require("./task.orm-entity");
let TaskHistoryOrmEntity = class TaskHistoryOrmEntity {
};
exports.TaskHistoryOrmEntity = TaskHistoryOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskHistoryOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_id' }),
    __metadata("design:type", String)
], TaskHistoryOrmEntity.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_orm_entity_1.TaskOrmEntity, (task) => task.history, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_orm_entity_1.TaskOrmEntity)
], TaskHistoryOrmEntity.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], TaskHistoryOrmEntity.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'old_value', type: 'text' }),
    __metadata("design:type", String)
], TaskHistoryOrmEntity.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_value', type: 'text' }),
    __metadata("design:type", String)
], TaskHistoryOrmEntity.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by_user_id' }),
    __metadata("design:type", String)
], TaskHistoryOrmEntity.prototype, "changedByUserId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], TaskHistoryOrmEntity.prototype, "changedAt", void 0);
exports.TaskHistoryOrmEntity = TaskHistoryOrmEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'task_history' })
], TaskHistoryOrmEntity);
//# sourceMappingURL=task-history.orm-entity.js.map