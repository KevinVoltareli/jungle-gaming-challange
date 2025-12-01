"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDescription = void 0;
class TaskDescription {
    constructor(_value) {
        this._value = _value;
    }
    get value() {
        return this._value;
    }
    static create(raw) {
        if (!raw) {
            return new TaskDescription(null);
        }
        const trimmed = raw.trim();
        if (trimmed.length === 0) {
            return new TaskDescription(null);
        }
        if (trimmed.length > 2000) {
            throw new Error('Task description must be at most 2000 characters long.');
        }
        return new TaskDescription(trimmed);
    }
}
exports.TaskDescription = TaskDescription;
//# sourceMappingURL=task-description.vo.js.map