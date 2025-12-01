import { Comment } from "../../../domain/task/comment.entity";
import { CommentOrmEntity } from "../typeorm/entities/comment.orm-entity";

export class CommentMapper {
  static toDomain(entity: CommentOrmEntity): Comment {
    return Comment.rehydrate({
      id: entity.id,
      taskId: entity.taskId,
      authorId: entity.authorId,
      content: entity.content,
      createdAt: entity.createdAt,
    });
  }

  static toOrm(comment: Comment): CommentOrmEntity {
    const orm = new CommentOrmEntity();

    orm.id = comment.id;
    orm.taskId = comment.taskId;
    orm.authorId = comment.authorId;
    orm.content = comment.content;
    orm.createdAt = comment.createdAt;

    return orm;
  }
}
