import { NotificationType } from "./notification-type.enum";
import { NotificationPayload, RawNotificationPayload } from "./value-objects/notification-payload.vo";
export interface NotificationProps {
    id: string;
    userId: string;
    type: NotificationType;
    payload: NotificationPayload;
    createdAt: Date;
    readAt?: Date | null;
}
export interface CreateNotificationProps {
    id: string;
    userId: string;
    type: NotificationType;
    payload: RawNotificationPayload;
    createdAt?: Date;
}
export declare class Notification {
    private _id;
    private _userId;
    private _type;
    private _payload;
    private _createdAt;
    private _readAt;
    private constructor();
    static createNew(props: CreateNotificationProps): Notification;
    static rehydrate(props: NotificationProps): Notification;
    get id(): string;
    get userId(): string;
    get type(): NotificationType;
    get payload(): NotificationPayload;
    get createdAt(): Date;
    get readAt(): Date | null;
    get isRead(): boolean;
    markAsRead(date?: Date): void;
}
