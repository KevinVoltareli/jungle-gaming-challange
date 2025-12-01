import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { INotificationRepository } from "../../../../domain/notification/notification-repository.interface";
import { Notification } from "../../../../domain/notification/notification.entity";
import { NotificationOrmEntity } from "../entities/notification.orm-entity";
import { NotificationMapper } from "../../mappers/notification.mapper";

@Injectable()
export class NotificationTypeOrmRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly ormRepo: Repository<NotificationOrmEntity>
  ) {}

  async save(notification: Notification): Promise<void> {
    const entity = NotificationMapper.toOrm(notification);
    await this.ormRepo.save(entity);
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;
    return NotificationMapper.toDomain(entity);
  }

  async listByUser(
    userId: string,
    page: number,
    size: number
  ): Promise<{ items: Notification[]; total: number }> {
    const [rows, total] = await this.ormRepo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      items: rows.map(NotificationMapper.toDomain),
      total,
    };
  }
}
