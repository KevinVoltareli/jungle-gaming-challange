import { Controller, Inject, Injectable, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { INotificationRepository } from "../../domain/notification/notification-repository.interface";
import { Notification } from "../../domain/notification/notification.entity";
import { NotificationType } from "../../domain/notification/notification-type.enum";
import { IIdGenerator } from "../ports/id-generator.interface";
import { IRealtimeNotifier } from "../ports/realtime-notifier.interface";

interface TaskCommentCreatedEventPayload {
  commentId: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  participantUserIds?: string[];
}

@Controller()
export class OnCommentCreatedHandler {
  private readonly logger = new Logger(OnCommentCreatedHandler.name);

  constructor(
    @Inject("INotificationRepository")
    private readonly notificationRepository: INotificationRepository,

    @Inject("IRealtimeNotifier")
    private readonly realtimeNotifier: IRealtimeNotifier,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator
  ) {}

  @EventPattern("task.comment.created")
  async handle(
    @Payload() payload: TaskCommentCreatedEventPayload
  ): Promise<void> {
    const participants = (payload.participantUserIds ?? []).filter(
      (id) => id !== payload.authorId
    );

    if (participants.length === 0) {
      this.logger.debug(
        `task.comment.created ${payload.commentId}: sem participantes`
      );
      return;
    }

    for (const userId of participants) {
      const notification = Notification.createNew({
        id: this.idGenerator.generate(),
        userId,
        type: NotificationType.TASK_COMMENT,
        payload,
      });

      await this.notificationRepository.save(notification);

      await this.realtimeNotifier.notifyUser(userId, "comment:new", {
        taskId: payload.taskId,
        commentId: payload.commentId,
        content: payload.content,
        authorId: payload.authorId,
        createdAt: payload.createdAt,
      });
    }
  }
}
