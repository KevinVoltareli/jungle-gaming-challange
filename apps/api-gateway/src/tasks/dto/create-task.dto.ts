import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TaskPriority } from "../../types/task-priority.enum";

export class CreateTaskDto {
  @ApiProperty({ example: "Implementar tela de login" })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: "Criar página de login com validação" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: "2025-12-31T23:59:59.000Z",
    description: "Prazo em ISO string (opcional)",
  })
  @IsString()
  @IsOptional()
  dueDate?: string;
}
