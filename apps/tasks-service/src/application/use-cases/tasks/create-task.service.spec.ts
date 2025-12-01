import { CreateTaskService, CreateTaskInput } from "./create-task.service";
import { ITaskRepository } from "../../../domain/task/task-repository.interface";
import { ITaskAssigneeRepository } from "../../../domain/task/task-assignee-repository.interface";
import { IIdGenerator } from "../../ports/id-generator.interface";
import { IEventPublisher } from "../../ports/event-publisher.interface";
import { TaskPriority } from "../../../domain/task/task-priority-enum";
import { TASK_CREATED_EVENT } from "../../events/tasks/task-events";

describe("CreateTaskService", () => {
  let service: CreateTaskService;

  let taskRepo: jest.Mocked<ITaskRepository>;
  let assigneeRepo: jest.Mocked<ITaskAssigneeRepository>;
  let idGenerator: jest.Mocked<IIdGenerator>;
  let eventPublisher: jest.Mocked<IEventPublisher>;

  beforeEach(() => {
    taskRepo = {
      save: jest.fn(),
    } as any;

    assigneeRepo = {
      replaceAssignees: jest.fn(),
    } as any;

    // vamos gerar ids diferentes pra task e pros assignees
    idGenerator = {
      generate: jest
        .fn()
        .mockReturnValueOnce("task-id-1") // 1ª chamada: id da task
        .mockReturnValueOnce("assignee-id-1")
        .mockReturnValueOnce("assignee-id-2"),
    } as any;

    eventPublisher = {
      publish: jest.fn(),
    } as any;

    service = new CreateTaskService(
      taskRepo,
      assigneeRepo,
      idGenerator,
      eventPublisher
    );
  });

  it("deve criar uma tarefa com assignees e publicar evento", async () => {
    const input: CreateTaskInput = {
      title: "Título teste",
      description: "Descrição teste",
      priority: TaskPriority.HIGH,
      creatorId: "user-123",
      dueDate: "2026-01-01T00:00:00.000Z",
      assigneeUserIds: ["user-123", "user-456"],
    };

    taskRepo.save.mockImplementation(async (task: any) => task);

    const result = await service.execute(input);

    // id retornado
    expect(result).toEqual({ id: "task-id-1" });

    // task salva
    expect(taskRepo.save).toHaveBeenCalledTimes(1);
    const savedTask = taskRepo.save.mock.calls[0][0] as any;

    expect(savedTask.id).toBe("task-id-1");
    expect(savedTask.title.value).toBe(input.title);
    expect(savedTask.description.value).toBe(input.description);
    expect(savedTask.priority).toBe(TaskPriority.HIGH);
    expect(savedTask.status).toBeDefined();
    expect(savedTask.creatorId).toBe(input.creatorId);

    // assignees salvos via repositório de assignees
    expect(assigneeRepo.replaceAssignees).toHaveBeenCalledTimes(1);
    const [taskIdArg, assignees] = assigneeRepo.replaceAssignees.mock
      .calls[0] as [string, any[]];

    expect(taskIdArg).toBe("task-id-1");
    expect(assignees).toHaveLength(2);
    expect(assignees.map((a) => a.userId)).toEqual(input.assigneeUserIds);

    // evento publicado
    expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
    const [eventName, payload] = eventPublisher.publish.mock.calls[0];

    expect(eventName).toBe(TASK_CREATED_EVENT);
    expect(payload.id).toBe("task-id-1");
    expect(payload.title).toBe(input.title);
    expect(payload.priority).toBe(TaskPriority.HIGH);
    expect(payload.creatorId).toBe(input.creatorId);
    expect(payload.assigneeUserIds).toEqual(input.assigneeUserIds);
  });

  it("deve criar uma tarefa sem assignees (não chama replaceAssignees)", async () => {
    const input: CreateTaskInput = {
      title: "Sem assignee",
      creatorId: "user-xyz",
      // priority e dueDate opcionais
    };

    taskRepo.save.mockImplementation(async (task: any) => task);

    const result = await service.execute(input);

    expect(result).toEqual({ id: "task-id-1" });
    expect(taskRepo.save).toHaveBeenCalledTimes(1);

    // como não tem assignees, não deve chamar replaceAssignees
    expect(assigneeRepo.replaceAssignees).not.toHaveBeenCalled();

    // ainda assim deve publicar o evento
    expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
  });
});
