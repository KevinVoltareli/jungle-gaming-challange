import { Repository } from "typeorm";
import { INotificationRepository } from "../../../../domain/notification/notification-repository.interface";
import { Notification } from "../../../../domain/notification/notification.entity";
import { NotificationOrmEntity } from "../entities/notification.orm-entity";
export declare class NotificationTypeOrmRepository implements INotificationRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<NotificationOrmEntity>);
    save(notification: Notification): Promise<void>;
    findById(id: string): Promise<Notification | null>;
    listByUser(userId: string, page: number, size: number): Promise<{
        items: Notification[];
        total: number;
    }>;
}
