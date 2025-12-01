import { Notification } from "../../../domain/notification/notification.entity";
import { NotificationOrmEntity } from "../typeorm/entities/notification.orm-entity";
export declare class NotificationMapper {
    static toDomain(entity: NotificationOrmEntity): Notification;
    static toOrm(notification: Notification): NotificationOrmEntity;
}
