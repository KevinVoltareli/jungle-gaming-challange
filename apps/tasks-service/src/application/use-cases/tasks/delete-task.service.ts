import { Inject, Injectable } from "@nestjs/common";
import { ITaskRepository } from "../../../domain/task/task-repository.interface";

@Injectable()
export class DeleteTaskService {
  constructor(
    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
