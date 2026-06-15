import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TaskStatusName } from '../enums/task-status.enum';

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

  @IsEnum(TaskStatusName)
  status!: TaskStatusName;

  @IsUUID()
  projectId!: string;
}
