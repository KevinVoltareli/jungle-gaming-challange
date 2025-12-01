import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority } from "../domain/task/task-priority-enum";
import { TaskStatus } from "../domain/task/task-status.enum";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  dueDate?: string | null;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsUUID()
  actorUserId!: string; // <- adiciona isso
}
