import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskStatusName } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(TaskStatusName)
  @IsOptional()
  status!: TaskStatusName;
}
