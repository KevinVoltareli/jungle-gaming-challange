export type RawNotificationPayload = Record<string, any>;
export declare class NotificationPayload {
    private readonly _value;
    private constructor();
    static create(value: RawNotificationPayload): NotificationPayload;
    static fromPlain(value: RawNotificationPayload): NotificationPayload;
    get value(): RawNotificationPayload;
    toJSON(): RawNotificationPayload;
}
