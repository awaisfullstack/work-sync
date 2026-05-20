import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Shift } from './entities/shift.entity';

type ShiftWithWorkedTime = {
  id: string;
  userId: string;
  clockInAt: Date;
  clockOutAt: Date | null;
  workedMinutes: number;
  workedHours: number;
  employee?: User;
};
@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift)
    private readonly shiftModel: typeof Shift,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
}
