import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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

  @IsUUID()
  @IsOptional()
  projectId?: string | null;

  @IsString()
  message!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> | null;
}
