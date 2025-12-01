import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  Delete,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "./dto/pagination.dto";

import { CreateTaskService } from "./application/use-cases/tasks/create-task.service";
import { UpdateTaskService } from "./application/use-cases/tasks/update-task.service";
import { ListTasksService } from "./application/use-cases/tasks/list-tasks.service";
import { AssignUsersToTaskService } from "./application/use-cases/tasks/assign-users-to-task.service";
import { GetTaskByIdService } from "./application/use-cases/tasks/get-task-by-id.service";
import { TaskMapper } from "./infrastructure/persistence/mappers/task.mapper";
import { DeleteTaskService } from "./application/use-cases/tasks/delete-task.service";

@Controller("tasks")
export class TasksController {
  constructor(
    private readonly createTaskService: CreateTaskService,
    private readonly updateTaskService: UpdateTaskService,
    private readonly listTasksService: ListTasksService,
    private readonly assignUsersService: AssignUsersToTaskService,
    private readonly getTaskByIdService: GetTaskByIdService,
    private readonly deleteTaskService: DeleteTaskService
  ) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.createTaskService.execute(dto);
  }

  @Get()
  async list(@Query() query: PaginationDto) {
    return this.listTasksService.execute(query);
  }

  @Get(":id")
  async getTask(@Param("id", new ParseUUIDPipe()) id: string) {
    const task = await this.getTaskByIdService.execute(id);
    return TaskMapper.toHttp(task); // usa o mesmo mapper que você usa no list/create
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    return this.updateTaskService.execute({ ...dto, taskId: id });
  }

  @Post(":id/assign")
  async assignUsers(
    @Param("id") id: string,
    @Body("userIds") userIds: string[],
    @Body("actorUserId") actorUserId: string
  ) {
    return this.assignUsersService.execute({
      taskId: id,
      userIds,
      actorUserId,
    });
  }

  @Delete(":id")
  async delete(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.deleteTaskService.execute(id);
    return { message: "Task deleted" };
  }
}
