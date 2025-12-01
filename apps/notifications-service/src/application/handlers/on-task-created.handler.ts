import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { INotificationRepository } from "../../domain/notification/notification-repository.interface";
import { Notification } from "../../domain/notification/notification.entity";
import { NotificationType } from "../../domain/notification/notification-type.enum";
import { IIdGenerator } from "../ports/id-generator.interface";
import { IRealtimeNotifier } from "../ports/realtime-notifier.interface";

@Controller()
export class OnTaskCreatedHandler {
  private readonly logger = new Logger(OnTaskCreatedHandler.name);

  constructor(
    @Inject("INotificationRepository")
    private readonly notificationRepository: INotificationRepository,

    @Inject("IRealtimeNotifier")
    private readonly realtimeNotifier: IRealtimeNotifier,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator
  ) {
    this.logger.log("✅ OnTaskCreatedHandler instanciado");
  }

  @EventPattern("task.created")
  async handle(@Payload() payload: any): Promise<void> {
    this.logger.log(
      "🔥 Evento recebido (task.created) => " + JSON.stringify(payload)
    );

    // se não tiver assignees, não faz nada
    if (!payload.assigneeUserIds || payload.assigneeUserIds.length === 0) {
      this.logger.warn("task.created sem assignees, ignorando");
      return;
    }

    for (const userId of payload.assigneeUserIds) {
      // 1) salva notificação no banco
      const notif = Notification.createNew({
        id: this.idGenerator.generate(),
        userId,
        type: NotificationType.TASK_ASSIGNED,
        payload,
      });

      await this.notificationRepository.save(notif);
      this.logger.log(
        `💾 Notificação salva para userId=${userId}, taskId=${payload.id}`
      );

      // 2) tenta mandar realtime (se o user estiver conectado)
      try {
        await this.realtimeNotifier.notifyUser(userId, "task:created", {
          taskId: payload.id,
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          status: payload.status,
          creatorId: payload.creatorId,
          createdAt: payload.createdAt,
          assigneeUserIds: payload.assigneeUserIds ?? [],
        });

        this.logger.log(
          `📡 Evento task:created enviado via WS para userId=${userId}`
        );
      } catch (err) {
        this.logger.error(
          `Erro ao enviar WS para userId=${userId}: ${String(err)}`
        );
      }
    }
  }
}
