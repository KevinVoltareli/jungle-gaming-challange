import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority } from "../domain/task/task-priority-enum";

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsUUID()
  creatorId!: string;
}
