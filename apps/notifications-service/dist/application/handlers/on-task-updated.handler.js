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
var OnTaskUpdatedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnTaskUpdatedHandler = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const notification_entity_1 = require("../../domain/notification/notification.entity");
const notification_type_enum_1 = require("../../domain/notification/notification-type.enum");
let OnTaskUpdatedHandler = OnTaskUpdatedHandler_1 = class OnTaskUpdatedHandler {
    constructor(notificationRepo, idGenerator, realtimeNotifier) {
        this.notificationRepo = notificationRepo;
        this.idGenerator = idGenerator;
        this.realtimeNotifier = realtimeNotifier;
        this.logger = new common_1.Logger(OnTaskUpdatedHandler_1.name);
    }
    async handle(payload) {
        var _a;
        const assigneeUserIds = (_a = payload.assigneeUserIds) !== null && _a !== void 0 ? _a : [];
        if (assigneeUserIds.length === 0) {
            this.logger.debug(`task.updated ${payload.id} sem assignees, nenhuma notificação criada`);
            return;
        }
        for (const userId of assigneeUserIds) {
            const notification = notification_entity_1.Notification.createNew({
                id: this.idGenerator.generate(),
                userId,
                type: notification_type_enum_1.NotificationType.TASK_STATUS_CHANGED,
                payload: {
                    eventType: "TASK_UPDATED",
                    taskId: payload.id,
                    title: payload.title,
                    status: payload.status,
                    priority: payload.priority,
                    updatedAt: payload.updatedAt,
                    changedByUserId: payload.changedByUserId,
                },
            });
            await this.notificationRepo.save(notification);
            await this.realtimeNotifier.notifyUser(userId, "task:updated", {
                taskId: payload.id,
                title: payload.title,
                status: payload.status,
                priority: payload.priority,
                updatedAt: payload.updatedAt,
                changedByUserId: payload.changedByUserId,
            });
        }
    }
};
exports.OnTaskUpdatedHandler = OnTaskUpdatedHandler;
__decorate([
    (0, microservices_1.EventPattern)("task.updated"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnTaskUpdatedHandler.prototype, "handle", null);
exports.OnTaskUpdatedHandler = OnTaskUpdatedHandler = OnTaskUpdatedHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object])
], OnTaskUpdatedHandler);
//# sourceMappingURL=on-task-updated.handler.js.map