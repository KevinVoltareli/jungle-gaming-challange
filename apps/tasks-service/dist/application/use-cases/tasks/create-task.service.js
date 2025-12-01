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
exports.CreateTaskService = void 0;
const common_1 = require("@nestjs/common");
const task_title_vo_1 = require("../../../domain/task/value-objects/task-title.vo");
const task_description_vo_1 = require("../../../domain/task/value-objects/task-description.vo");
const task_priority_enum_1 = require("../../../domain/task/task-priority-enum");
const task_status_enum_1 = require("../../../domain/task/task-status.enum");
const task_entity_1 = require("../../../domain/task/task.entity");
const task_assignee_entity_1 = require("../../../domain/task/task-assignee.entity");
const task_events_1 = require("../../events/tasks/task-events");
let CreateTaskService = class CreateTaskService {
    constructor(taskRepository, assigneeRepository, idGenerator, eventPublisher) {
        this.taskRepository = taskRepository;
        this.assigneeRepository = assigneeRepository;
        this.idGenerator = idGenerator;
        this.eventPublisher = eventPublisher;
    }
    async execute(input) {
        const id = this.idGenerator.generate();
        const now = new Date();
        const title = task_title_vo_1.TaskTitle.create(input.title);
        const description = task_description_vo_1.TaskDescription.create(input.description ?? null);
        let dueDate = null;
        if (input.dueDate) {
            const parsed = new Date(input.dueDate);
            if (!Number.isNaN(parsed.getTime())) {
                dueDate = parsed;
            }
        }
        // cria a task de domínio (note o creatorId, não creatorUserId)
        const task = task_entity_1.Task.createNew({
            id,
            title,
            description,
            priority: input.priority ?? task_priority_enum_1.TaskPriority.MEDIUM,
            status: task_status_enum_1.TaskStatus.TODO,
            creatorId: input.creatorId,
            dueDate,
        });
        // assignees
        const assignees = input.assigneeUserIds?.map((userId) => task_assignee_entity_1.TaskAssignee.createNew({
            id: this.idGenerator.generate(),
            taskId: task.id,
            userId,
        })) ?? [];
        await this.taskRepository.save(task);
        if (assignees.length > 0) {
            await this.assigneeRepository.replaceAssignees(task.id, assignees);
        }
        const payload = {
            id: task.id,
            title: task.title.value,
            description: task.description.value,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            creatorId: input.creatorId,
            assigneeUserIds: assignees.map((a) => a.userId),
        };
        await this.eventPublisher.publish(task_events_1.TASK_CREATED_EVENT, payload);
        return { id: task.id };
    }
};
exports.CreateTaskService = CreateTaskService;
exports.CreateTaskService = CreateTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ITaskRepository")),
    __param(1, (0, common_1.Inject)("ITaskAssigneeRepository")),
    __param(2, (0, common_1.Inject)("IIdGenerator")),
    __param(3, (0, common_1.Inject)("IEventPublisher")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateTaskService);
//# sourceMappingURL=create-task.service.js.map