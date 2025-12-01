import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentsApi,
  type CommentDto,
  type CreateCommentRequest,
} from "../../libs/api";
import { type PaginatedResponse } from "../../libs/api/types";

type UseCommentsParams = {
  page?: number;
  size?: number;
};

export function useComments(
  taskId: string | undefined,
  params: UseCommentsParams = {}
) {
  const queryClient = useQueryClient();
  const { page = 1, size = 10 } = params;

  const commentsQuery = useQuery<PaginatedResponse<CommentDto>>({
    queryKey: ["comments", { taskId, page, size }],
    queryFn: () =>
      commentsApi.listTaskComments(taskId as string, { page, size }),
    enabled: !!taskId,
  });

  const createCommentMutation = useMutation({
    mutationFn: (payload: CreateCommentRequest) =>
      commentsApi.createComment(taskId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { taskId }],
      });
    },
  });

  return {
    commentsQuery,

    createComment: createCommentMutation.mutate,
    createCommentStatus: createCommentMutation.status,
    createCommentError: createCommentMutation.error,
  };
}
