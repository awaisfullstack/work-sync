import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  ActivityAction,
  ActivityEntityType,
} from '../entities/activity-log.entity';

export class CreateActivityLogDto {
  @IsUUID()
  @IsOptional()
  actorId?: string | null;

  @IsEnum(ActivityAction)
  action!: ActivityAction;

  @IsEnum(ActivityEntityType)
  entityType!: ActivityEntityType;

  @IsUUID()
  @IsOptional()
  entityId?: string | null;

  @IsString()
  message!: string;
}
