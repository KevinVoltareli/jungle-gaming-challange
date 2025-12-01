import { Injectable, Inject } from "@nestjs/common";
import {
  TaskHistory,
  TaskHistoryField,
} from "../../../domain/task/task-history.entity";
import { ITaskHistoryRepository } from "../../../domain/task/task-history-repository.interface";
import { IIdGenerator } from "../../ports/id-generator.interface";

export interface RegisterTaskHistoryInput {
  taskId: string;
  field: TaskHistoryField;
  oldValue: string;
  newValue: string;
  changedByUserId: string;
}

@Injectable()
export class RegisterTaskHistoryService {
  constructor(
    @Inject("ITaskHistoryRepository")
    private readonly historyRepository: ITaskHistoryRepository,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(input: RegisterTaskHistoryInput): Promise<void> {
    const history = TaskHistory.forFieldChange({
      id: this.idGenerator.generate(),
      taskId: input.taskId,
      field: input.field,
      oldValue: input.oldValue,
      newValue: input.newValue,
      changedByUserId: input.changedByUserId,
    });

    await this.historyRepository.save(history);
  }
}
