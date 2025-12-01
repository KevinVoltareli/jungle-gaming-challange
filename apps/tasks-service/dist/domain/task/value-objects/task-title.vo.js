"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTitle = void 0;
class TaskTitle {
    constructor(_value) {
        this._value = _value;
    }
    get value() {
        return this._value;
    }
    static create(raw) {
        if (!raw) {
            throw new Error('Task title is required.');
        }
        const trimmed = raw.trim();
        if (trimmed.length < 3) {
            throw new Error('Task title must be at least 3 characters long.');
        }
        if (trimmed.length > 150) {
            throw new Error('Task title must be at most 150 characters long.');
        }
        return new TaskTitle(trimmed);
    }
}
exports.TaskTitle = TaskTitle;
//# sourceMappingURL=task-title.vo.js.map