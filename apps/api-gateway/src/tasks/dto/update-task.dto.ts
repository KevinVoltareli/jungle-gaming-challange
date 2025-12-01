import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { TaskPriority } from "../../types/task-priority.enum";
import { TaskStatus } from "../../types/task-status.enum";

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: "Novo título da tarefa" })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: "Descrição atualizada" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: "2025-12-31T23:59:59.000Z",
    description: "Novo prazo (opcional)",
  })
  @IsString()
  @IsOptional()
  dueDate?: string;
}
