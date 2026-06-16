import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class ManualShiftDto {
  @IsUUID()
  userId!: string;

  @IsDateString()
  clockInAt!: string;

  @IsOptional()
  @IsDateString()
  clockOutAt?: string;
}
