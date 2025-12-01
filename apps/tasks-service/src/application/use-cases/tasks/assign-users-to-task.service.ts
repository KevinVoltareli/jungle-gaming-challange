import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { ITaskRepository } from "../../../domain/task/task-repository.interface";
import { ITaskAssigneeRepository } from "../../../domain/task/task-assignee-repository.interface";
import { TaskAssignee } from "../../../domain/task/task-assignee.entity";
import { IIdGenerator } from "../../ports/id-generator.interface";
import { ITaskHistoryRepository } from "../../../domain/task/task-history-repository.interface";
import { TaskHistory } from "../../../domain/task/task-history.entity";

export interface AssignUsersInput {
  taskId: string;
  actorUserId: string; // <- QUEM está fazendo a mudança
  userIds: string[]; // <- lista de usuários atribuídos
}

@Injectable()
export class AssignUsersToTaskService {
  constructor(
    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository,

    @Inject("ITaskAssigneeRepository")
    private readonly assigneeRepository: ITaskAssigneeRepository,

    @Inject("ITaskHistoryRepository")
    private readonly historyRepository: ITaskHistoryRepository,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(input: AssignUsersInput): Promise<void> {
    const task = await this.taskRepository.findById(input.taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const currentAssignees = await this.assigneeRepository.findByTask(task.id);

    const oldUserIds = currentAssignees.map((a) => a.userId).join(",");
    const newUserIds = input.userIds.join(",");

    const newAssignees = input.userIds.map((userId) =>
      TaskAssignee.createNew({
        id: this.idGenerator.generate(),
        taskId: task.id,
        userId,
      })
    );

    await this.assigneeRepository.replaceAssignees(task.id, newAssignees);

    const history = TaskHistory.forFieldChange({
      id: this.idGenerator.generate(),
      taskId: task.id,
      field: "assignee",
      oldValue: oldUserIds,
      newValue: newUserIds,
      changedByUserId: input.actorUserId,
    });

    await this.historyRepository.save(history);
  }
}
