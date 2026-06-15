import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'deadline', 'title'])
  sortBy?: 'createdAt' | 'updatedAt' | 'deadline' | 'title' = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
