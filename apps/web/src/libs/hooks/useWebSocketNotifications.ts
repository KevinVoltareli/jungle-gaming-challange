// apps/web/src/libs/hooks/useWebSocketNotifications.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getNotificationsSocket } from "../websockets/notifications-socket";

interface TaskCreatedPayload {
  taskId: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  creatorId?: string;
  createdAt?: string;
  assigneeUserIds?: string[];
  // pode ter mais campos, não importa
  [key: string]: unknown;
}

interface CommentNewPayload {
  taskId: string;
  commentId?: string;
  [key: string]: unknown;
}

export function useWebSocketNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getNotificationsSocket();

    // DEBUG: ver tudo que chega
    /*socket.onAny((event, ...args) => {
      console.log("[WS:any]", event, ...args);
    });*/

    const onTaskCreated = (payload: TaskCreatedPayload) => {
      console.log("[WS] task:created =>", payload);

      // invalida QUALQUER query cuja key comece com "tasks"
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === "tasks";
        },
      });
    };

    const onCommentNew = (payload: CommentNewPayload) => {
      console.log("[WS] comment:new =>", payload);

      if (payload.taskId) {
        const taskId = payload.taskId;

        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key[0] === "task" &&
              key[1] === taskId &&
              key[2] === "comments"
            );
          },
        });
      }
    };

    socket.on("task:created", onTaskCreated);
    socket.on("comment:new", onCommentNew);

    return () => {
      socket.off("task:created", onTaskCreated);
      socket.off("comment:new", onCommentNew);
      socket.offAny(); // limpa também o debug
    };
  }, [queryClient]);
}
