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
exports.TaskTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_orm_entity_1 = require("../entities/task.orm-entity");
const task_mapper_1 = require("../../mappers/task.mapper");
let TaskTypeOrmRepository = class TaskTypeOrmRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        const orm = await this.repo.findOne({
            where: { id },
            relations: ["assignees"],
        });
        return orm ? task_mapper_1.TaskMapper.toDomain(orm) : null;
    }
    async save(task) {
        const orm = task_mapper_1.TaskMapper.toOrm(task);
        await this.repo.save(orm);
    }
    async findPaginated(params) {
        const page = params.page ?? 1;
        const size = params.size ?? 10;
        const where = {};
        if (params.status) {
            where.status = params.status;
        }
        const [rows, total] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * size,
            take: size,
            order: { createdAt: "DESC" },
        });
        return {
            items: rows.map(task_mapper_1.TaskMapper.toDomain),
            total,
            page,
            size,
        };
    }
    async findByStatus(status) {
        const rows = await this.repo.find({ where: { status } });
        return rows.map(task_mapper_1.TaskMapper.toDomain);
    }
    async delete(id) {
        await this.repo.delete({ id });
    }
};
exports.TaskTypeOrmRepository = TaskTypeOrmRepository;
exports.TaskTypeOrmRepository = TaskTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_orm_entity_1.TaskOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskTypeOrmRepository);
//# sourceMappingURL=task.typeorm-repository.js.map