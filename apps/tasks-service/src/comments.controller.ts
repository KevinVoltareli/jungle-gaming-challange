import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PaginationDto } from "./dto/pagination.dto";

import { CreateCommentService } from "./application/use-cases/comments/create-comment.service";
import { ListCommentsService } from "./application/use-cases/comments/list-comments.service";

@Controller("tasks/:taskId/comments")
export class CommentsController {
  constructor(
    private readonly createCommentService: CreateCommentService,
    private readonly listCommentsService: ListCommentsService
  ) {}

  @Post()
  async create(@Param("taskId") taskId: string, @Body() dto: CreateCommentDto) {
    return this.createCommentService.execute({ taskId, ...dto });
  }

  @Get()
  async list(@Param("taskId") taskId: string, @Query() query: PaginationDto) {
    return this.listCommentsService.execute({ taskId, ...query });
  }
}
