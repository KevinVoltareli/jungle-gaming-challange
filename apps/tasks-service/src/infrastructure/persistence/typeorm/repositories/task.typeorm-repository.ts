import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  ITaskRepository,
  TaskPaginationParams,
  TaskPaginationResult,
} from "../../../../domain/task/task-repository.interface";
import { Task } from "../../../../domain/task/task.entity";
import { TaskStatus } from "../../../../domain/task/task-status.enum";
import { TaskOrmEntity } from "../entities/task.orm-entity";
import { TaskMapper } from "../../mappers/task.mapper";

@Injectable()
export class TaskTypeOrmRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly repo: Repository<TaskOrmEntity>
  ) {}

  async findById(id: string): Promise<Task | null> {
    const orm = await this.repo.findOne({
      where: { id },
      relations: ["assignees"],
    });

    return orm ? TaskMapper.toDomain(orm) : null;
  }

  async save(task: Task): Promise<void> {
    const orm = TaskMapper.toOrm(task);
    await this.repo.save(orm);
  }

  async findPaginated(
    params: TaskPaginationParams
  ): Promise<TaskPaginationResult> {
    const page = params.page ?? 1;
    const size = params.size ?? 10;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const [rows, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: "DESC" },
    });

    return {
      items: rows.map(TaskMapper.toDomain),
      total,
      page,
      size,
    };
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const rows = await this.repo.find({ where: { status } });
    return rows.map(TaskMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
