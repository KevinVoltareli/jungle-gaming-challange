"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
class Comment {
    constructor(_id, _taskId, _authorId, _content, _createdAt) {
        this._id = _id;
        this._taskId = _taskId;
        this._authorId = _authorId;
        this._content = _content;
        this._createdAt = _createdAt;
    }
    get id() {
        return this._id;
    }
    get taskId() {
        return this._taskId;
    }
    get authorId() {
        return this._authorId;
    }
    get content() {
        return this._content;
    }
    get createdAt() {
        return this._createdAt;
    }
    static createNew(props) {
        if (!props.content || props.content.trim().length === 0) {
            throw new Error('Comment content is required.');
        }
        const content = props.content.trim();
        if (content.length > 1000) {
            throw new Error('Comment content must be at most 1000 characters.');
        }
        return new Comment(props.id, props.taskId, props.authorId, content, new Date());
    }
    static rehydrate(props) {
        return new Comment(props.id, props.taskId, props.authorId, props.content, props.createdAt ?? new Date());
    }
}
exports.Comment = Comment;
//# sourceMappingURL=comment.entity.js.map