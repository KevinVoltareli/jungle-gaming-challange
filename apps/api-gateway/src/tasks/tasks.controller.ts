import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user.type";

import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";

@ApiTags("Tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: "Criar nova tarefa" })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: "Tarefa criada com sucesso" })
  async createTask(@CurrentUser() user: AuthUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Listar tarefas com paginação" })
  @ApiResponse({
    status: 200,
    description: "Lista paginada de tarefas",
  })
  async listTasks(@Query() query: PaginationDto) {
    return this.tasksService.listTasks(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obter detalhes de uma tarefa" })
  @ApiResponse({ status: 200, description: "Detalhe da tarefa" })
  async getTask(@Param("id") rawId: string) {
    const id = rawId.replace(/^"|"$/g, "");
    return this.tasksService.getTaskById(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar uma tarefa" })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: "Tarefa atualizada" })
  async updateTask(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(user.userId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remover uma tarefa" })
  @ApiResponse({ status: 200, description: "Tarefa deletada" })
  async deleteTask(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.tasksService.deleteTask(user.userId, id);
  }

  @Post(":id/assign")
  @ApiOperation({ summary: "Atribuir usuários à tarefa" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userIds: {
          type: "array",
          items: { type: "string", format: "uuid" },
        },
      },
      required: ["userIds"],
    },
  })
  async assignUsers(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body("userIds") userIds: string[]
  ) {
    return this.tasksService.assignUsers(id, user.userId, userIds);
  }

  @Post(":id/comments")
  @ApiOperation({ summary: "Criar comentário em uma tarefa" })
  @ApiBody({ type: CreateCommentDto })
  async createComment(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.tasksService.createComment(user.userId, id, dto);
  }

  @Get(":id/comments")
  @ApiOperation({ summary: "Listar comentários de uma tarefa" })
  async listComments(@Param("id") id: string, @Query() query: PaginationDto) {
    return this.tasksService.listComments(id, query);
  }
}
