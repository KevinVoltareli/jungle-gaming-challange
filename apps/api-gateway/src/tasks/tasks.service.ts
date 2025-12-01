import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class TasksService {
  private readonly baseUrl =
    process.env.TASKS_SERVICE_URL || "http://localhost:3003";

  constructor(private readonly http: HttpService) {
    console.log("🔗 TASKS_SERVICE_URL =", this.baseUrl);
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const body = { ...dto, creatorId: userId };

    const observable = this.http.post(`${this.baseUrl}/tasks`, body);
    const { data } = await firstValueFrom(observable);
    return data;
  }

  async listTasks(query: PaginationDto) {
    const observable = this.http.get(`${this.baseUrl}/tasks`, {
      params: query,
    });
    const { data } = await firstValueFrom(observable);
    return data;
  }

  async getTaskById(id: string) {
    const observable = this.http.get(`${this.baseUrl}/tasks/${id}`);
    const { data } = await firstValueFrom(observable);
    return data;
  }

  async updateTask(userId: string, id: string, dto: UpdateTaskDto) {
    const body = { ...dto, actorUserId: userId };

    const observable = this.http.put(`${this.baseUrl}/tasks/${id}`, body);
    const { data } = await firstValueFrom(observable);
    return data;
  }

  async deleteTask(userId: string, id: string) {
    const observable = this.http.delete(`${this.baseUrl}/tasks/${id}`, {
      headers: { "x-actor-id": userId },
    });
    const { data } = await firstValueFrom(observable);
    return data;
  }

  async assignUsers(taskId: string, actorUserId: string, userIds: string[]) {
    const observable = this.http.post(
      `${this.baseUrl}/tasks/${taskId}/assign`,
      {
        actorUserId,
        userIds,
      }
    );

    const { data } = await firstValueFrom(observable);
    return data;
  }

  async createComment(userId: string, taskId: string, dto: CreateCommentDto) {
    const body = {
      content: dto.content,
      authorId: userId,
    };

    const observable = this.http.post(
      `${this.baseUrl}/tasks/${taskId}/comments`,
      body
    );
    const { data } = await firstValueFrom(observable);
    return data;
  }

  async listComments(taskId: string, query: PaginationDto) {
    const observable = this.http.get(
      `${this.baseUrl}/tasks/${taskId}/comments`,
      { params: query }
    );
    const { data } = await firstValueFrom(observable);
    return data;
  }
}
