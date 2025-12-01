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
exports.UpdateTaskService = void 0;
const common_1 = require("@nestjs/common");
const task_title_vo_1 = require("../../../domain/task/value-objects/task-title.vo");
const task_description_vo_1 = require("../../../domain/task/value-objects/task-description.vo");
const task_history_entity_1 = require("../../../domain/task/task-history.entity");
const task_events_1 = require("../../events/tasks/task-events");
let UpdateTaskService = class UpdateTaskService {
    constructor(taskRepository, taskHistoryRepository, idGenerator, eventPublisher) {
        this.taskRepository = taskRepository;
        this.taskHistoryRepository = taskHistoryRepository;
        this.idGenerator = idGenerator;
        this.eventPublisher = eventPublisher;
    }
    async execute(input) {
        const task = await this.taskRepository.findById(input.taskId);
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        // 🔹 título
        if (input.title !== undefined) {
            const newTitle = task_title_vo_1.TaskTitle.create(input.title);
            const history = task.changeTitle(newTitle, input.actorUserId);
            await this.taskHistoryRepository.save(task_history_entity_1.TaskHistory.rehydrate({
                id: this.idGenerator.generate(),
                taskId: history.taskId,
                field: history.field,
                oldValue: history.oldValue,
                newValue: history.newValue,
                changedByUserId: history.changedByUserId,
            }));
        }
        // 🔹 descrição
        if (input.description !== undefined) {
            const newDesc = task_description_vo_1.TaskDescription.create(input.description ?? null);
            const history = task.changeDescription(newDesc, input.actorUserId);
            await this.taskHistoryRepository.save(task_history_entity_1.TaskHistory.rehydrate({
                id: this.idGenerator.generate(),
                taskId: history.taskId,
                field: history.field,
                oldValue: history.oldValue,
                newValue: history.newValue,
                changedByUserId: history.changedByUserId,
            }));
        }
        // 🔹 prioridade
        if (input.priority !== undefined) {
            const history = task.changePriority(input.priority, input.actorUserId);
            await this.taskHistoryRepository.save(task_history_entity_1.TaskHistory.rehydrate({
                id: this.idGenerator.generate(),
                taskId: history.taskId,
                field: history.field,
                oldValue: history.oldValue,
                newValue: history.newValue,
                changedByUserId: history.changedByUserId,
            }));
        }
        // 🔹 status
        if (input.status !== undefined) {
            const history = task.changeStatus(input.status, input.actorUserId);
            await this.taskHistoryRepository.save(task_history_entity_1.TaskHistory.rehydrate({
                id: this.idGenerator.generate(),
                taskId: history.taskId,
                field: history.field,
                oldValue: history.oldValue,
                newValue: history.newValue,
                changedByUserId: history.changedByUserId,
            }));
        }
        // 🔹 dueDate
        if (input.dueDate !== undefined) {
            let dueDate = null;
            if (input.dueDate) {
                const parsed = new Date(input.dueDate);
                if (!Number.isNaN(parsed.getTime())) {
                    dueDate = parsed;
                }
            }
            const oldValue = task.dueDate ? task.dueDate.toISOString() : "";
            const newValue = dueDate ? dueDate.toISOString() : "";
            task._dueDate = dueDate;
            const history = task_history_entity_1.TaskHistory.forFieldChange({
                id: this.idGenerator.generate(),
                taskId: task.id,
                field: "dueDate",
                oldValue,
                newValue,
                changedByUserId: input.actorUserId,
            });
            await this.taskHistoryRepository.save(history);
        }
        await this.taskRepository.save(task);
        const payload = {
            id: task.id,
            title: task.title.value,
            description: task.description.value,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            priority: task.priority,
            status: task.status,
            updatedAt: task.updatedAt.toISOString(),
            changedByUserId: input.actorUserId,
        };
        await this.eventPublisher.publish(task_events_1.TASK_UPDATED_EVENT, payload);
    }
};
exports.UpdateTaskService = UpdateTaskService;
exports.UpdateTaskService = UpdateTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ITaskRepository")),
    __param(1, (0, common_1.Inject)("ITaskHistoryRepository")),
    __param(2, (0, common_1.Inject)("IIdGenerator")),
    __param(3, (0, common_1.Inject)("IEventPublisher")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UpdateTaskService);
//# sourceMappingURL=update-task.service.js.map