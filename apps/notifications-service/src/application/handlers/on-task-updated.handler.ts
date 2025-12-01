import { Injectable, Logger, Inject, Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { INotificationRepository } from "../../domain/notification/notification-repository.interface";
import { Notification } from "../../domain/notification/notification.entity";
import { NotificationType } from "../../domain/notification/notification-type.enum";
import { IIdGenerator } from "../ports/id-generator.interface";
import { IRealtimeNotifier } from "../ports/realtime-notifier.interface";

interface TaskUpdatedEventPayload {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: string;
  status: string;
  updatedAt: string;
  changedByUserId: string;
  assigneeUserIds?: string[];
}

@Controller()
export class OnTaskUpdatedHandler {
  private readonly logger = new Logger(OnTaskUpdatedHandler.name);

  constructor(
    @Inject("INotificationRepository")
    private readonly notificationRepository: INotificationRepository,

    @Inject("IRealtimeNotifier")
    private readonly realtimeNotifier: IRealtimeNotifier,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator
  ) {}

  @EventPattern("task.updated")
  async handle(@Payload() payload: TaskUpdatedEventPayload): Promise<void> {
    const assignees = payload.assigneeUserIds ?? [];

    if (assignees.length === 0) {
      this.logger.debug(`task.updated ${payload.id}: sem assignees`);
      return;
    }

    for (const userId of assignees) {
      const notification = Notification.createNew({
        id: this.idGenerator.generate(),
        userId,
        type: NotificationType.TASK_STATUS_CHANGED,
        payload,
      });

      await this.notificationRepository.save(notification);
      await this.realtimeNotifier.notifyUser(userId, "task:updated", {
        taskId: payload.id,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        status: payload.status,
        updatedAt: payload.updatedAt,
        changedByUserId: payload.changedByUserId,
        assigneeUserIds: payload.assigneeUserIds ?? [],
      });
    }
  }
}
