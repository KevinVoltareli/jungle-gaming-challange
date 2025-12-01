import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  CommentPaginationParams,
  CommentPaginationResult,
  ICommentRepository,
} from "../../../../domain/task/comment-repository.interface";
import { Comment } from "../../../../domain/task/comment.entity";
import { CommentOrmEntity } from "../entities/comment.orm-entity";
import { CommentMapper } from "../../mappers/comment.mapper";

@Injectable()
export class CommentTypeOrmRepository implements ICommentRepository {
  constructor(
    @InjectRepository(CommentOrmEntity)
    private readonly ormRepo: Repository<CommentOrmEntity>
  ) {}

  async findByTask(
    params: CommentPaginationParams
  ): Promise<CommentPaginationResult> {
    const { taskId, page, size } = params;

    const [entities, total] = await this.ormRepo.findAndCount({
      where: { taskId },
      order: { createdAt: "ASC" },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      items: entities.map((e) => CommentMapper.toDomain(e)),
      total,
    };
  }

  async findById(id: string): Promise<Comment | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return CommentMapper.toDomain(entity);
  }

  async save(comment: Comment): Promise<void> {
    const entity = CommentMapper.toOrm(comment);
    await this.ormRepo.save(entity);
  }
}
