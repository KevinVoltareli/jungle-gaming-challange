"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssignee = void 0;
class TaskAssignee {
    constructor(_id, _taskId, _userId, _assignedAt) {
        this._id = _id;
        this._taskId = _taskId;
        this._userId = _userId;
        this._assignedAt = _assignedAt;
    }
    get id() {
        return this._id;
    }
    get taskId() {
        return this._taskId;
    }
    get userId() {
        return this._userId;
    }
    get assignedAt() {
        return this._assignedAt;
    }
    static createNew(props) {
        return new TaskAssignee(props.id, props.taskId, props.userId, new Date());
    }
    static rehydrate(props) {
        return new TaskAssignee(props.id, props.taskId, props.userId, props.assignedAt ?? new Date());
    }
}
exports.TaskAssignee = TaskAssignee;
//# sourceMappingURL=task-assignee.entity.js.map