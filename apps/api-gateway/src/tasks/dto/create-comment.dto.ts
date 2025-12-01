import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ example: "Essa tarefa precisa ser feita até sexta." })
  @IsString()
  content!: string;
}
