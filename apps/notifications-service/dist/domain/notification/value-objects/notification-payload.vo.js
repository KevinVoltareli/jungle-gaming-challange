"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPayload = void 0;
class NotificationPayload {
    constructor(_value) {
        this._value = _value;
    }
    static create(value) {
        return new NotificationPayload(Object.assign({}, value));
    }
    static fromPlain(value) {
        return new NotificationPayload(Object.assign({}, value));
    }
    get value() {
        return Object.assign({}, this._value);
    }
    toJSON() {
        return this.value;
    }
}
exports.NotificationPayload = NotificationPayload;
//# sourceMappingURL=notification-payload.vo.js.map