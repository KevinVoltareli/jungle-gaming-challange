"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMapper = void 0;
const comment_entity_1 = require("../../../domain/task/comment.entity");
const comment_orm_entity_1 = require("../typeorm/entities/comment.orm-entity");
class CommentMapper {
    static toDomain(entity) {
        return comment_entity_1.Comment.rehydrate({
            id: entity.id,
            taskId: entity.taskId,
            authorId: entity.authorId,
            content: entity.content,
            createdAt: entity.createdAt,
        });
    }
    static toOrm(comment) {
        const orm = new comment_orm_entity_1.CommentOrmEntity();
        orm.id = comment.id;
        orm.taskId = comment.taskId;
        orm.authorId = comment.authorId;
        orm.content = comment.content;
        orm.createdAt = comment.createdAt;
        return orm;
    }
}
exports.CommentMapper = CommentMapper;
//# sourceMappingURL=comment.mapper.js.map