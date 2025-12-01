import { Comment } from './comment.entity';

export interface CommentPaginationParams {
  taskId: string;
  page: number;
  size: number;
}

export interface CommentPaginationResult {
  items: Comment[];
  total: number;
}

export interface ICommentRepository {
  findByTask(params: CommentPaginationParams): Promise<CommentPaginationResult>;

  findById(id: string): Promise<Comment | null>;

  save(comment: Comment): Promise<void>;
}
