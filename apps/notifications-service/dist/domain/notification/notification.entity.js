"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const notification_payload_vo_1 = require("./value-objects/notification-payload.vo");
class Notification {
    constructor(props) {
        var _a;
        this._id = props.id;
        this._userId = props.userId;
        this._type = props.type;
        this._payload = props.payload;
        this._createdAt = props.createdAt;
        this._readAt = (_a = props.readAt) !== null && _a !== void 0 ? _a : null;
    }
    static createNew(props) {
        var _a;
        const createdAt = (_a = props.createdAt) !== null && _a !== void 0 ? _a : new Date();
        const payloadVo = notification_payload_vo_1.NotificationPayload.create(props.payload);
        return new Notification({
            id: props.id,
            userId: props.userId,
            type: props.type,
            payload: payloadVo,
            createdAt,
            readAt: null,
        });
    }
    static rehydrate(props) {
        return new Notification(props);
    }
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get type() {
        return this._type;
    }
    get payload() {
        return this._payload;
    }
    get createdAt() {
        return this._createdAt;
    }
    get readAt() {
        return this._readAt;
    }
    get isRead() {
        return this._readAt !== null;
    }
    markAsRead(date) {
        if (this._readAt) {
            return;
        }
        this._readAt = date !== null && date !== void 0 ? date : new Date();
    }
}
exports.Notification = Notification;
//# sourceMappingURL=notification.entity.js.map