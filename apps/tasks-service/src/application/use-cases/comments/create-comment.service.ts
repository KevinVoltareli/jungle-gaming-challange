import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";

import { ITaskRepository } from "../../../domain/task/task-repository.interface";
import { ICommentRepository } from "../../../domain/task/comment-repository.interface";
import { Comment } from "../../../domain/task/comment.entity";
import { IIdGenerator } from "../../ports/id-generator.interface";

import { IEventPublisher } from "../../ports/event-publisher.interface";
import {
  TASK_COMMENT_CREATED_EVENT,
  TaskCommentCreatedEventPayload,
} from "../../events/tasks/task-events";

export interface CreateCommentInput {
  taskId: string;
  authorId: string;
  content: string;
}

export interface CreateCommentOutput {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

@Injectable()
export class CreateCommentService {
  constructor(
    @Inject("ICommentRepository")
    private readonly commentRepository: ICommentRepository,

    @Inject("ITaskRepository")
    private readonly taskRepository: ITaskRepository,

    @Inject("IIdGenerator")
    private readonly idGenerator: IIdGenerator,

    @Inject("IEventPublisher")
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(input: CreateCommentInput): Promise<CreateCommentOutput> {
    const task = await this.taskRepository.findById(input.taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (!input.content || input.content.trim().length === 0) {
      throw new BadRequestException("Comment content is required");
    }

    const comment = Comment.createNew({
      id: this.idGenerator.generate(),
      taskId: task.id,
      authorId: input.authorId,
      content: input.content,
    });

    await this.commentRepository.save(comment);

    const payload: TaskCommentCreatedEventPayload = {
      id: comment.id,
      taskId: comment.taskId,
      authorId: comment.authorId,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    };

    await this.eventPublisher.publish(TASK_COMMENT_CREATED_EVENT, payload);

    return {
      id: comment.id,
      taskId: comment.taskId,
      authorId: comment.authorId,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  }
}
