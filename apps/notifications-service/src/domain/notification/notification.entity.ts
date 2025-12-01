import { NotificationType } from "./notification-type.enum";
import {
  NotificationPayload,
  RawNotificationPayload,
} from "./value-objects/notification-payload.vo";

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

export class Notification {
  private _id: string;
  private _userId: string;
  private _type: NotificationType;
  private _payload: NotificationPayload;
  private _createdAt: Date;
  private _readAt: Date | null;

  private constructor(props: NotificationProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._type = props.type;
    this._payload = props.payload;
    this._createdAt = props.createdAt;
    this._readAt = props.readAt ?? null;
  }

  // fábrica para notificação nova
  static createNew(props: CreateNotificationProps): Notification {
    const createdAt = props.createdAt ?? new Date();

    const payloadVo = NotificationPayload.create(props.payload);

    return new Notification({
      id: props.id,
      userId: props.userId,
      type: props.type,
      payload: payloadVo,
      createdAt,
      readAt: null,
    });
  }

  // rehidratar a partir do banco
  static rehydrate(props: NotificationProps): Notification {
    return new Notification(props);
  }

  // getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get type(): NotificationType {
    return this._type;
  }

  get payload(): NotificationPayload {
    return this._payload;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get readAt(): Date | null {
    return this._readAt;
  }

  get isRead(): boolean {
    return this._readAt !== null;
  }

  markAsRead(date?: Date): void {
    if (this._readAt) {
      return; // já lida
    }
    this._readAt = date ?? new Date();
  }
}
