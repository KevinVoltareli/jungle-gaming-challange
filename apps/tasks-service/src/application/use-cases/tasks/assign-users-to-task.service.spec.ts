import {
  AssignUsersToTaskService,
  AssignUsersInput,
} from "./assign-users-to-task.service";
import { ITaskRepository } from "../../../domain/task/task-repository.interface";
import { ITaskAssigneeRepository } from "../../../domain/task/task-assignee-repository.interface";
import { ITaskHistoryRepository } from "../../../domain/task/task-history-repository.interface";
import { IIdGenerator } from "../../ports/id-generator.interface";

describe("AssignUsersToTaskService", () => {
  let service: AssignUsersToTaskService;

  let taskRepo: jest.Mocked<ITaskRepository>;
  let assigneeRepo: jest.Mocked<ITaskAssigneeRepository>;
  let historyRepo: jest.Mocked<ITaskHistoryRepository>;
  let idGenerator: jest.Mocked<IIdGenerator>;

  beforeEach(() => {
    const fakeTask: any = {
      id: "task-123",
    };

    taskRepo = {
      findById: jest.fn().mockResolvedValue(fakeTask),
    } as any;

    assigneeRepo = {
      findByTask: jest
        .fn()
        .mockResolvedValue([{ userId: "old-user-1" } as any]),
      replaceAssignees: jest.fn(),
    } as any;

    historyRepo = {
      save: jest.fn(),
    } as any;

    idGenerator = {
      generate: jest.fn().mockReturnValue("history-id-1"),
    } as any;

    service = new AssignUsersToTaskService(
      taskRepo,
      assigneeRepo,
      historyRepo,
      idGenerator
    );
  });

  it("deve atribuir usuários à tarefa, registrar histórico e salvar", async () => {
    const input: AssignUsersInput = {
      taskId: "task-123",
      actorUserId: "actor-1",
      userIds: ["user-1", "user-2"],
    };

    await service.execute(input);

    // buscou a task
    expect(taskRepo.findById).toHaveBeenCalledWith("task-123");

    // buscou assignees antigos
    expect(assigneeRepo.findByTask).toHaveBeenCalledWith("task-123");

    // substituiu assignees
    expect(assigneeRepo.replaceAssignees).toHaveBeenCalledTimes(1);
    const [taskIdArg, newAssignees] = assigneeRepo.replaceAssignees.mock
      .calls[0] as [string, any[]];

    expect(taskIdArg).toBe("task-123");
    expect(newAssignees).toHaveLength(2);
    expect(newAssignees.map((a) => a.userId)).toEqual(input.userIds);

    // histórico salvo
    expect(historyRepo.save).toHaveBeenCalledTimes(1);
    const history = historyRepo.save.mock.calls[0][0] as any;

    expect(history.taskId).toBe("task-123");
    expect(history.field ?? history.fieldName ?? "assignee").toBe("assignee");
    expect(history.changedByUserId).toBe("actor-1");

    // id do histórico gerado pelo idGenerator
    expect(idGenerator.generate).toHaveBeenCalled();
  });

  it("deve lançar erro se a task não existir", async () => {
    (taskRepo.findById as jest.Mock).mockResolvedValueOnce(null);

    const input: AssignUsersInput = {
      taskId: "inexistente",
      actorUserId: "actor-1",
      userIds: ["user-1"],
    };

    await expect(service.execute(input)).rejects.toThrow("Task not found");

    expect(assigneeRepo.replaceAssignees).not.toHaveBeenCalled();
    expect(historyRepo.save).not.toHaveBeenCalled();
  });
});
