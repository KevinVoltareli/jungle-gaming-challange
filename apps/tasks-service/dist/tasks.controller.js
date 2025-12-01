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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const create_task_service_1 = require("./application/use-cases/tasks/create-task.service");
const update_task_service_1 = require("./application/use-cases/tasks/update-task.service");
const list_tasks_service_1 = require("./application/use-cases/tasks/list-tasks.service");
const assign_users_to_task_service_1 = require("./application/use-cases/tasks/assign-users-to-task.service");
const get_task_by_id_service_1 = require("./application/use-cases/tasks/get-task-by-id.service");
const task_mapper_1 = require("./infrastructure/persistence/mappers/task.mapper");
const delete_task_service_1 = require("./application/use-cases/tasks/delete-task.service");
let TasksController = class TasksController {
    constructor(createTaskService, updateTaskService, listTasksService, assignUsersService, getTaskByIdService, deleteTaskService) {
        this.createTaskService = createTaskService;
        this.updateTaskService = updateTaskService;
        this.listTasksService = listTasksService;
        this.assignUsersService = assignUsersService;
        this.getTaskByIdService = getTaskByIdService;
        this.deleteTaskService = deleteTaskService;
    }
    async create(dto) {
        return this.createTaskService.execute(dto);
    }
    async list(query) {
        return this.listTasksService.execute(query);
    }
    async getTask(id) {
        const task = await this.getTaskByIdService.execute(id);
        return task_mapper_1.TaskMapper.toHttp(task); // usa o mesmo mapper que você usa no list/create
    }
    async update(id, dto) {
        return this.updateTaskService.execute({ ...dto, taskId: id });
    }
    async assignUsers(id, userIds, actorUserId) {
        return this.assignUsersService.execute({
            taskId: id,
            userIds,
            actorUserId,
        });
    }
    async delete(id) {
        await this.deleteTaskService.execute(id);
        return { message: "Task deleted" };
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTask", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/assign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("userIds")),
    __param(2, (0, common_1.Body)("actorUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "assignUsers", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "delete", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)("tasks"),
    __metadata("design:paramtypes", [create_task_service_1.CreateTaskService,
        update_task_service_1.UpdateTaskService,
        list_tasks_service_1.ListTasksService,
        assign_users_to_task_service_1.AssignUsersToTaskService,
        get_task_by_id_service_1.GetTaskByIdService,
        delete_task_service_1.DeleteTaskService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map