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
var OnTaskCreatedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnTaskCreatedHandler = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const notification_entity_1 = require("../../domain/notification/notification.entity");
const notification_type_enum_1 = require("../../domain/notification/notification-type.enum");
let OnTaskCreatedHandler = OnTaskCreatedHandler_1 = class OnTaskCreatedHandler {
    constructor(notificationRepo, idGenerator, realtimeNotifier) {
        this.notificationRepo = notificationRepo;
        this.idGenerator = idGenerator;
        this.realtimeNotifier = realtimeNotifier;
        this.logger = new common_1.Logger(OnTaskCreatedHandler_1.name);
    }
    async handle(payload) {
        var _a;
        const assigneeUserIds = (_a = payload.assigneeUserIds) !== null && _a !== void 0 ? _a : [];
        if (assigneeUserIds.length === 0) {
            this.logger.debug(`task.created ${payload.id} sem assignees, nenhuma notificação criada`);
            return;
        }
        for (const userId of assigneeUserIds) {
            const notification = notification_entity_1.Notification.createNew({
                id: this.idGenerator.generate(),
                userId,
                type: notification_type_enum_1.NotificationType.TASK_ASSIGNED,
                payload: {
                    eventType: "TASK_CREATED",
                    taskId: payload.id,
                    title: payload.title,
                    priority: payload.priority,
                    status: payload.status,
                    creatorId: payload.creatorId,
                    createdAt: payload.createdAt,
                },
            });
            await this.notificationRepo.save(notification);
            await this.realtimeNotifier.notifyUser(userId, "task:created", {
                taskId: payload.id,
                title: payload.title,
                priority: payload.priority,
                status: payload.status,
                creatorId: payload.creatorId,
                createdAt: payload.createdAt,
            });
        }
    }
};
exports.OnTaskCreatedHandler = OnTaskCreatedHandler;
__decorate([
    (0, microservices_1.EventPattern)("task.created"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnTaskCreatedHandler.prototype, "handle", null);
exports.OnTaskCreatedHandler = OnTaskCreatedHandler = OnTaskCreatedHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object])
], OnTaskCreatedHandler);
//# sourceMappingURL=on-task-created.handler.js.map