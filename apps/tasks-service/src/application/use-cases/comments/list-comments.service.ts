import { Injectable, Inject } from "@nestjs/common";
import { ICommentRepository } from "../../../domain/task/comment-repository.interface";

export interface ListCommentsInput {
  taskId: string;
  page: number;
  size: number;
}

export interface ListCommentsItem {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface ListCommentsOutput {
  items: ListCommentsItem[];
  total: number;
  page: number;
  size: number;
}

@Injectable()
export class ListCommentsService {
  constructor(
    @Inject("ICommentRepository")
    private readonly commentRepository: ICommentRepository
  ) {}

  async execute(input: ListCommentsInput): Promise<ListCommentsOutput> {
    const page = input.page > 0 ? input.page : 1;
    const size = input.size > 0 ? input.size : 10;

    const result = await this.commentRepository.findByTask({
      taskId: input.taskId,
      page,
      size,
    });

    return {
      items: result.items.map((comment) => ({
        id: comment.id,
        authorId: comment.authorId,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
      total: result.total,
      page,
      size,
    };
  }
}
