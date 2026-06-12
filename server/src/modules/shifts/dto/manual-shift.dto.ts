import { IsDateString, IsUUID } from 'class-validator';

export class ManualShiftDto {
  @IsUUID()
  userId!: string;

  @IsDateString()
  clockInAt!: string;

  @IsDateString()
  clockOutAt!: string;
}
