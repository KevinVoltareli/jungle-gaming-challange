import { Notification } from "../../../domain/notification/notification.entity";
import { NotificationType } from "../../../domain/notification/notification-type.enum";
import { NotificationPayload } from "../../../domain/notification/value-objects/notification-payload.vo";
import { NotificationOrmEntity } from "../typeorm/entities/notification.orm-entity";

export class NotificationMapper {
  static toDomain(entity: NotificationOrmEntity): Notification {
    return Notification.rehydrate({
      id: entity.id,
      userId: entity.userId,
      type: entity.type as NotificationType,
      payload: NotificationPayload.fromPlain(entity.payload),
      createdAt: entity.createdAt,
      readAt: entity.readAt,
    });
  }

  static toOrm(notification: Notification): NotificationOrmEntity {
    const orm = new NotificationOrmEntity();
    orm.id = notification.id;
    orm.userId = notification.userId;
    orm.type = notification.type;
    orm.payload = notification.payload.toJSON();
    orm.createdAt = notification.createdAt;
    orm.readAt = notification.readAt;
    return orm;
  }
}
