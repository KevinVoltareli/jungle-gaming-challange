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
exports.CommentOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const task_orm_entity_1 = require("./task.orm-entity");
let CommentOrmEntity = class CommentOrmEntity {
};
exports.CommentOrmEntity = CommentOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CommentOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_id' }),
    __metadata("design:type", String)
], CommentOrmEntity.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_orm_entity_1.TaskOrmEntity, (task) => task.comments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_orm_entity_1.TaskOrmEntity)
], CommentOrmEntity.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id' }),
    __metadata("design:type", String)
], CommentOrmEntity.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CommentOrmEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CommentOrmEntity.prototype, "createdAt", void 0);
exports.CommentOrmEntity = CommentOrmEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'task_comments' })
], CommentOrmEntity);
//# sourceMappingURL=comment.orm-entity.js.map