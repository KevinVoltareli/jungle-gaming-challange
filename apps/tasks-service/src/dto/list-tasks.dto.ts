import { PaginationDto } from "./pagination.dto";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../domain/task/task-status.enum";
import { TaskPriority } from "../domain/task/task-priority-enum";

export class ListTasksDto extends PaginationDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  search?: string;
}
