"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_orm_entity_1 = require("./infrastructure/persistence/typeorm/entities/task.orm-entity");
const comment_orm_entity_1 = require("./infrastructure/persistence/typeorm/entities/comment.orm-entity");
const task_assignee_orm_entity_1 = require("./infrastructure/persistence/typeorm/entities/task-assignee.orm-entity");
const task_history_orm_entity_1 = require("./infrastructure/persistence/typeorm/entities/task-history.orm-entity");
const task_typeorm_repository_1 = require("./infrastructure/persistence/typeorm/repositories/task.typeorm-repository");
const comment_typeorm_repository_1 = require("./infrastructure/persistence/typeorm/repositories/comment.typeorm-repository");
const task_assignee_typeorm_repository_1 = require("./infrastructure/persistence/typeorm/repositories/task-assignee.typeorm-repository");
const task_history_typeorm_repository_1 = require("./infrastructure/persistence/typeorm/repositories/task-history.typeorm-repository");
const create_task_service_1 = require("./application/use-cases/tasks/create-task.service");
const update_task_service_1 = require("./application/use-cases/tasks/update-task.service");
const list_tasks_service_1 = require("./application/use-cases/tasks/list-tasks.service");
const assign_users_to_task_service_1 = require("./application/use-cases/tasks/assign-users-to-task.service");
const create_comment_service_1 = require("./application/use-cases/comments/create-comment.service");
const list_comments_service_1 = require("./application/use-cases/comments/list-comments.service");
const register_task_history_service_1 = require("./application/use-cases/history/register-task-history.service");
const rabbit_event_publisher_1 = require("./infrastructure/messaging/rabbit-event-publisher");
const uuid_generator_adapter_1 = require("./infrastructure/ids/uuid-generator.adapter");
const tasks_controller_1 = require("./tasks.controller");
const comments_controller_1 = require("./comments.controller");
const get_task_by_id_service_1 = require("./application/use-cases/tasks/get-task-by-id.service");
const delete_task_service_1 = require("./application/use-cases/tasks/delete-task.service");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                task_orm_entity_1.TaskOrmEntity,
                comment_orm_entity_1.CommentOrmEntity,
                task_assignee_orm_entity_1.TaskAssigneeOrmEntity,
                task_history_orm_entity_1.TaskHistoryOrmEntity,
            ]),
        ],
        controllers: [tasks_controller_1.TasksController, comments_controller_1.CommentsController],
        providers: [
            { provide: "ITaskRepository", useClass: task_typeorm_repository_1.TaskTypeOrmRepository },
            { provide: "ICommentRepository", useClass: comment_typeorm_repository_1.CommentTypeOrmRepository },
            {
                provide: "ITaskHistoryRepository",
                useClass: task_history_typeorm_repository_1.TaskHistoryTypeOrmRepository,
            },
            {
                provide: "ITaskAssigneeRepository",
                useClass: task_assignee_typeorm_repository_1.TaskAssigneeTypeOrmRepository,
            },
            create_task_service_1.CreateTaskService,
            update_task_service_1.UpdateTaskService,
            list_tasks_service_1.ListTasksService,
            assign_users_to_task_service_1.AssignUsersToTaskService,
            create_comment_service_1.CreateCommentService,
            list_comments_service_1.ListCommentsService,
            register_task_history_service_1.RegisterTaskHistoryService,
            get_task_by_id_service_1.GetTaskByIdService,
            delete_task_service_1.DeleteTaskService,
            { provide: "IEventPublisher", useClass: rabbit_event_publisher_1.RabbitEventPublisher },
            { provide: "IIdGenerator", useClass: uuid_generator_adapter_1.UUIDGenerator },
        ],
    })
], TasksModule);
//# sourceMappingURL=tasks.module.js.map