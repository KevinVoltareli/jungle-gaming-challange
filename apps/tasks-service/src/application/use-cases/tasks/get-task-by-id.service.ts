import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITaskRepository } from "../../../domain/task/task-repository.interface";

@Injectable()
export class GetTaskByIdService {
  constructor(
    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(id: string) {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }
}
