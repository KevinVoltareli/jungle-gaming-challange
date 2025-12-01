import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ITaskHistoryRepository } from '../../../../domain/task/task-history-repository.interface';
import { TaskHistory } from '../../../../domain/task/task-history.entity';
import { TaskHistoryOrmEntity } from '../entities/task-history.orm-entity';
import { TaskHistoryMapper } from '../../mappers/task-history.mapper';

@Injectable()
export class TaskHistoryTypeOrmRepository implements ITaskHistoryRepository {
  constructor(
    @InjectRepository(TaskHistoryOrmEntity)
    private readonly ormRepo: Repository<TaskHistoryOrmEntity>,
  ) {}

  async findByTask(taskId: string): Promise<TaskHistory[]> {
    const entities = await this.ormRepo.find({
      where: { taskId },
      order: { changedAt: 'DESC' },
    });

    return entities.map((e) => TaskHistoryMapper.toDomain(e));
  }

  async save(entry: TaskHistory): Promise<void> {
    const entity = TaskHistoryMapper.toOrm(entry);
    await this.ormRepo.save(entity);
  }
}
