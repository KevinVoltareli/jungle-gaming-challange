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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssigneeTypeOrmRepository = void 0;
// apps/tasks-service/src/infrastructure/persistence/typeorm/repositories/task-assignee.typeorm-repository.ts
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_assignee_orm_entity_1 = require("../entities/task-assignee.orm-entity");
const task_assignee_mapper_1 = require("../../mappers/task-assignee.mapper");
let TaskAssigneeTypeOrmRepository = class TaskAssigneeTypeOrmRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async findByTask(taskId) {
        const rows = await this.repo.find({ where: { taskId } });
        return rows.map(task_assignee_mapper_1.TaskAssigneeMapper.toDomain);
    }
    async replaceAssignees(taskId, assignees) {
        // apaga os atuais
        await this.repo.delete({ taskId });
        // salva os novos
        const rows = assignees.map(task_assignee_mapper_1.TaskAssigneeMapper.toOrm);
        await this.repo.save(rows);
    }
};
exports.TaskAssigneeTypeOrmRepository = TaskAssigneeTypeOrmRepository;
exports.TaskAssigneeTypeOrmRepository = TaskAssigneeTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_assignee_orm_entity_1.TaskAssigneeOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskAssigneeTypeOrmRepository);
//# sourceMappingURL=task-assignee.typeorm-repository.js.map