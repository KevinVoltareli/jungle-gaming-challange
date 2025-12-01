"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const task_history_entity_1 = require("./task-history.entity");
class Task {
    constructor(_id, _title, _description, _dueDate, _priority, _status, _creatorId, assignees, comments, history, _createdAt, _updatedAt) {
        this._id = _id;
        this._title = _title;
        this._description = _description;
        this._dueDate = _dueDate;
        this._priority = _priority;
        this._status = _status;
        this._creatorId = _creatorId;
        this._createdAt = _createdAt;
        this._updatedAt = _updatedAt;
        this._assignees = assignees;
        this._comments = comments;
        this._history = history;
    }
    // ========= GETTERS =========
    get id() {
        return this._id;
    }
    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
    get dueDate() {
        return this._dueDate;
    }
    get priority() {
        return this._priority;
    }
    get status() {
        return this._status;
    }
    get creatorId() {
        return this._creatorId;
    }
    get assignees() {
        return [...this._assignees];
    }
    get comments() {
        return [...this._comments];
    }
    get history() {
        return [...this._history];
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // ========= FACTORIES =========
    static createNew(props) {
        const createdAt = new Date();
        const updatedAt = createdAt;
        const assignees = props.assignees ?? [];
        const comments = props.comments ?? [];
        const history = props.history ?? [];
        return new Task(props.id, props.title, props.description, props.dueDate ?? null, props.priority, props.status, props.creatorId, assignees, comments, history, createdAt, updatedAt);
    }
    static rehydrate(props) {
        return new Task(props.id, props.title, props.description, props.dueDate ?? null, props.priority, props.status, props.creatorId, props.assignees ?? [], props.comments ?? [], props.history ?? [], props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
    // ========= BEHAVIOUR =========
    changeTitle(newTitle, changedByUserId) {
        const oldValue = this._title.value;
        this._title = newTitle;
        this.touch();
        const history = task_history_entity_1.TaskHistory.forFieldChange({
            id: crypto.randomUUID(),
            taskId: this._id,
            field: "title",
            oldValue,
            newValue: newTitle.value,
            changedByUserId,
        });
        this._history.push(history);
        return history;
    }
    changeDescription(newDescription, changedByUserId) {
        const oldValue = this._description.value ?? "";
        this._description = newDescription;
        this.touch();
        const history = task_history_entity_1.TaskHistory.forFieldChange({
            id: crypto.randomUUID(),
            taskId: this._id,
            field: "description",
            oldValue,
            newValue: newDescription.value ?? "",
            changedByUserId,
        });
        this._history.push(history);
        return history;
    }
    changePriority(newPriority, changedByUserId) {
        const oldValue = this._priority;
        this._priority = newPriority;
        this.touch();
        const history = task_history_entity_1.TaskHistory.forFieldChange({
            id: crypto.randomUUID(),
            taskId: this._id,
            field: "priority",
            oldValue,
            newValue: newPriority,
            changedByUserId,
        });
        this._history.push(history);
        return history;
    }
    changeStatus(newStatus, changedByUserId) {
        const oldValue = this._status;
        this._status = newStatus;
        this.touch();
        const history = task_history_entity_1.TaskHistory.forFieldChange({
            id: crypto.randomUUID(),
            taskId: this._id,
            field: "status",
            oldValue,
            newValue: newStatus,
            changedByUserId,
        });
        this._history.push(history);
        return history;
    }
    addAssignee(assignee) {
        const alreadyAssigned = this._assignees.some((a) => a.userId === assignee.userId);
        if (!alreadyAssigned) {
            this._assignees.push(assignee);
            this.touch();
        }
    }
    addComment(comment) {
        this._comments.push(comment);
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Task = Task;
//# sourceMappingURL=task.entity.js.map