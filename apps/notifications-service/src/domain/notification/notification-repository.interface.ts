import { Notification } from "./notification.entity";

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  listByUser(
    userId: string,
    page: number,
    size: number
  ): Promise<{ items: Notification[]; total: number }>;
}
