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
exports.AssignUsersToTaskService = void 0;
const common_1 = require("@nestjs/common");
const task_assignee_entity_1 = require("../../../domain/task/task-assignee.entity");
const task_history_entity_1 = require("../../../domain/task/task-history.entity");
let AssignUsersToTaskService = class AssignUsersToTaskService {
    constructor(taskRepository, assigneeRepository, historyRepository, idGenerator) {
        this.taskRepository = taskRepository;
        this.assigneeRepository = assigneeRepository;
        this.historyRepository = historyRepository;
        this.idGenerator = idGenerator;
    }
    async execute(input) {
        const task = await this.taskRepository.findById(input.taskId);
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        const currentAssignees = await this.assigneeRepository.findByTask(task.id);
        const oldUserIds = currentAssignees.map((a) => a.userId).join(",");
        const newUserIds = input.userIds.join(",");
        const newAssignees = input.userIds.map((userId) => task_assignee_entity_1.TaskAssignee.createNew({
            id: this.idGenerator.generate(),
            taskId: task.id,
            userId,
        }));
        await this.assigneeRepository.replaceAssignees(task.id, newAssignees);
        const history = task_history_entity_1.TaskHistory.forFieldChange({
            id: this.idGenerator.generate(),
            taskId: task.id,
            field: "assignee",
            oldValue: oldUserIds,
            newValue: newUserIds,
            changedByUserId: input.actorUserId,
        });
        await this.historyRepository.save(history);
    }
};
exports.AssignUsersToTaskService = AssignUsersToTaskService;
exports.AssignUsersToTaskService = AssignUsersToTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ITaskRepository")),
    __param(1, (0, common_1.Inject)("ITaskAssigneeRepository")),
    __param(2, (0, common_1.Inject)("ITaskHistoryRepository")),
    __param(3, (0, common_1.Inject)("IIdGenerator")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AssignUsersToTaskService);
//# sourceMappingURL=assign-users-to-task.service.js.map