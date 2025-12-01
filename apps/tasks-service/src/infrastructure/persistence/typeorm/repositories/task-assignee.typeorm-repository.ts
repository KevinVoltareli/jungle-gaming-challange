// apps/tasks-service/src/infrastructure/persistence/typeorm/repositories/task-assignee.typeorm-repository.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITaskAssigneeRepository } from "../../../../domain/task/task-assignee-repository.interface";
import { TaskAssignee } from "../../../../domain/task/task-assignee.entity";
import { TaskAssigneeOrmEntity } from "../entities/task-assignee.orm-entity";
import { TaskAssigneeMapper } from "../../mappers/task-assignee.mapper";

@Injectable()
export class TaskAssigneeTypeOrmRepository implements ITaskAssigneeRepository {
  constructor(
    @InjectRepository(TaskAssigneeOrmEntity)
    private readonly repo: Repository<TaskAssigneeOrmEntity>
  ) {}

  async findByTask(taskId: string): Promise<TaskAssignee[]> {
    const rows = await this.repo.find({ where: { taskId } });
    return rows.map(TaskAssigneeMapper.toDomain);
  }

  async replaceAssignees(
    taskId: string,
    assignees: TaskAssignee[]
  ): Promise<void> {
    // apaga os atuais
    await this.repo.delete({ taskId });

    // salva os novos
    const rows = assignees.map(TaskAssigneeMapper.toOrm);
    await this.repo.save(rows);
  }
}
