"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskHistory = void 0;
class TaskHistory {
    constructor(_id, _taskId, _field, _oldValue, _newValue, _changedByUserId, _changedAt) {
        this._id = _id;
        this._taskId = _taskId;
        this._field = _field;
        this._oldValue = _oldValue;
        this._newValue = _newValue;
        this._changedByUserId = _changedByUserId;
        this._changedAt = _changedAt;
    }
    get id() {
        return this._id;
    }
    get taskId() {
        return this._taskId;
    }
    get field() {
        return this._field;
    }
    get oldValue() {
        return this._oldValue;
    }
    get newValue() {
        return this._newValue;
    }
    get changedByUserId() {
        return this._changedByUserId;
    }
    get changedAt() {
        return this._changedAt;
    }
    static forFieldChange(props) {
        return new TaskHistory(props.id, props.taskId, props.field, props.oldValue, props.newValue, props.changedByUserId, props.changedAt ?? new Date());
    }
    static rehydrate(props) {
        return new TaskHistory(props.id, props.taskId, props.field, props.oldValue, props.newValue, props.changedByUserId, props.changedAt ?? new Date());
    }
}
exports.TaskHistory = TaskHistory;
//# sourceMappingURL=task-history.entity.js.map