import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate!: string;

  @IsUUID()
  projectId!: string;

  @IsUUID()
  @IsOptional()
  assignedUserId?: string;
}
