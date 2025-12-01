import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { TaskOrmEntity } from "./infrastructure/persistence/typeorm/entities/task.orm-entity";
import { CommentOrmEntity } from "./infrastructure/persistence/typeorm/entities/comment.orm-entity";
import { TaskAssigneeOrmEntity } from "./infrastructure/persistence/typeorm/entities/task-assignee.orm-entity";
import { TaskHistoryOrmEntity } from "./infrastructure/persistence/typeorm/entities/task-history.orm-entity";

import { TaskTypeOrmRepository } from "./infrastructure/persistence/typeorm/repositories/task.typeorm-repository";
import { CommentTypeOrmRepository } from "./infrastructure/persistence/typeorm/repositories/comment.typeorm-repository";
import { TaskAssigneeTypeOrmRepository } from "./infrastructure/persistence/typeorm/repositories/task-assignee.typeorm-repository";
import { TaskHistoryTypeOrmRepository } from "./infrastructure/persistence/typeorm/repositories/task-history.typeorm-repository";

import { CreateTaskService } from "./application/use-cases/tasks/create-task.service";
import { UpdateTaskService } from "./application/use-cases/tasks/update-task.service";
import { ListTasksService } from "./application/use-cases/tasks/list-tasks.service";
import { AssignUsersToTaskService } from "./application/use-cases/tasks/assign-users-to-task.service";

import { CreateCommentService } from "./application/use-cases/comments/create-comment.service";
import { ListCommentsService } from "./application/use-cases/comments/list-comments.service";

import { RegisterTaskHistoryService } from "./application/use-cases/history/register-task-history.service";

import { RabbitEventPublisher } from "./infrastructure/messaging/rabbit-event-publisher";
import { UUIDGenerator } from "./infrastructure/ids/uuid-generator.adapter";

import { TasksController } from "./tasks.controller";
import { CommentsController } from "./comments.controller";
import { GetTaskByIdService } from "./application/use-cases/tasks/get-task-by-id.service";
import { DeleteTaskService } from "./application/use-cases/tasks/delete-task.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskOrmEntity,
      CommentOrmEntity,
      TaskAssigneeOrmEntity,
      TaskHistoryOrmEntity,
    ]),
  ],
  controllers: [TasksController, CommentsController],
  providers: [
    { provide: "ITaskRepository", useClass: TaskTypeOrmRepository },
    { provide: "ICommentRepository", useClass: CommentTypeOrmRepository },
    {
      provide: "ITaskHistoryRepository",
      useClass: TaskHistoryTypeOrmRepository,
    },
    {
      provide: "ITaskAssigneeRepository",
      useClass: TaskAssigneeTypeOrmRepository,
    },

    CreateTaskService,
    UpdateTaskService,
    ListTasksService,
    AssignUsersToTaskService,
    CreateCommentService,
    ListCommentsService,
    RegisterTaskHistoryService,
    GetTaskByIdService,
    DeleteTaskService,

    { provide: "IEventPublisher", useClass: RabbitEventPublisher },
    { provide: "IIdGenerator", useClass: UUIDGenerator },
  ],
})
export class TasksModule {}
