import { IsEnum } from 'class-validator';
import { TaskStatusName } from '../entities/task-status.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatusName)
  status!: TaskStatusName;
}
