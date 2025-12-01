import { ApiClient } from "./api-client";
import { PaginatedResponse } from "./types";

export interface CommentDto {
  id: string;
  taskId: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

export class CommentsApiService {
  constructor(private readonly client: ApiClient) {}

  listTaskComments(
    taskId: string,
    params: { page?: number; size?: number } = {}
  ) {
    const { page = 1, size = 10 } = params;

    return this.client.get<PaginatedResponse<CommentDto>>(
      `api/tasks/${taskId}/comments`,
      {
        query: { page, size },
      }
    );
  }

  createComment(taskId: string, payload: CreateCommentRequest) {
    return this.client.post<CommentDto>(`api/tasks/${taskId}/comments`, {
      body: payload,
    });
  }
}
