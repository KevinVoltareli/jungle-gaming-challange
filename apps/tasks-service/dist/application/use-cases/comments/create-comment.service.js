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
exports.CreateCommentService = void 0;
const common_1 = require("@nestjs/common");
const comment_entity_1 = require("../../../domain/task/comment.entity");
const task_events_1 = require("../../events/tasks/task-events");
let CreateCommentService = class CreateCommentService {
    constructor(commentRepository, taskRepository, idGenerator, eventPublisher) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.idGenerator = idGenerator;
        this.eventPublisher = eventPublisher;
    }
    async execute(input) {
        const task = await this.taskRepository.findById(input.taskId);
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        if (!input.content || input.content.trim().length === 0) {
            throw new common_1.BadRequestException("Comment content is required");
        }
        const comment = comment_entity_1.Comment.createNew({
            id: this.idGenerator.generate(),
            taskId: task.id,
            authorId: input.authorId,
            content: input.content,
        });
        await this.commentRepository.save(comment);
        const payload = {
            id: comment.id,
            taskId: comment.taskId,
            authorId: comment.authorId,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
        };
        await this.eventPublisher.publish(task_events_1.TASK_COMMENT_CREATED_EVENT, payload);
        return {
            id: comment.id,
            taskId: comment.taskId,
            authorId: comment.authorId,
            content: comment.content,
            createdAt: comment.createdAt,
        };
    }
};
exports.CreateCommentService = CreateCommentService;
exports.CreateCommentService = CreateCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ICommentRepository")),
    __param(1, (0, common_1.Inject)("ITaskRepository")),
    __param(2, (0, common_1.Inject)("IIdGenerator")),
    __param(3, (0, common_1.Inject)("IEventPublisher")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateCommentService);
//# sourceMappingURL=create-comment.service.js.map