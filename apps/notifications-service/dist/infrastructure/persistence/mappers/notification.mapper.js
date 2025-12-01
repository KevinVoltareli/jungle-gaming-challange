"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
const notification_entity_1 = require("../../../domain/notification/notification.entity");
const notification_payload_vo_1 = require("../../../domain/notification/value-objects/notification-payload.vo");
const notification_orm_entity_1 = require("../typeorm/entities/notification.orm-entity");
class NotificationMapper {
    static toDomain(entity) {
        return notification_entity_1.Notification.rehydrate({
            id: entity.id,
            userId: entity.userId,
            type: entity.type,
            payload: notification_payload_vo_1.NotificationPayload.fromPlain(entity.payload),
            createdAt: entity.createdAt,
            readAt: entity.readAt,
        });
    }
    static toOrm(notification) {
        const orm = new notification_orm_entity_1.NotificationOrmEntity();
        orm.id = notification.id;
        orm.userId = notification.userId;
        orm.type = notification.type;
        orm.payload = notification.payload.toJSON();
        orm.createdAt = notification.createdAt;
        orm.readAt = notification.readAt;
        return orm;
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=notification.mapper.js.map