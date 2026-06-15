import { IsEnum } from 'class-validator';
import { TaskStatusName } from '../enums/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatusName)
  status!: TaskStatusName;
}
