import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/users.enum';
import { Shift, ShiftStatus } from './entities/shift.entity';
import { AuthenticatedUser } from '../../common/types/auth.types';
import { ShiftQueryDto } from './dto/shift-query.dto';

import { Op, WhereOptions } from 'sequelize';
import { ManualShiftDto } from './dto/manual-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift)
    private readonly shiftModel: typeof Shift,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  private async isUserExist(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private calculateWorkedMinutes(
    clockInAt: Date,
    clockOutAt: Date | null,
  ): number {
    const endTime = clockOutAt ?? new Date();

    const diffMs = endTime.getTime() - clockInAt.getTime();

    if (diffMs <= 0) {
      return 0;
    }

    return Math.floor(diffMs / 1000 / 60);
  }

  async clockIn(id: string): Promise<Shift> {
    const user = await this.isUserExist(id);

    if ((user.role as Role) !== Role.EMPLOYEE) {
      throw new ForbiddenException('Only employees can clock in');
    }

    const shift = await this.shiftModel.findOne({
      where: {
        userId: user.id,
        status: ShiftStatus.ACTIVE,
      },
    });

    if (shift) {
      throw new ConflictException('You already have an active shift');
    }
    return await this.shiftModel.create({
      userId: user.id,
      clockInAt: new Date(),
      clockOutAt: null,
      status: ShiftStatus.ACTIVE,
    } as Shift);
  }

  async getMyActiveShift(userId: string): Promise<Shift | null> {
    const shift = await this.shiftModel.findOne({
      where: {
        userId,
        status: ShiftStatus.ACTIVE,
      },
    });

    if (!shift) {
      return null;
    }

    return shift;
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    return shift;
  }

  async getAllShifts(query: ShiftQueryDto, user: AuthenticatedUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions<Shift> = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.fromDate || query.toDate) {
      where.clockInAt = {
        ...(query.fromDate ? { [Op.gte]: query.fromDate } : {}),
        ...(query.toDate ? { [Op.lte]: query.toDate } : {}),
      };
    }

    /* if (query.fromDate || query.toDate) {
      if (query.fromDate) {
        where.clockInAt = {
          [Op.gte]: query.fromDate,
        };
      }
      if (query.toDate) {
        where.clockInAt = {
          [Op.lte]: query.toDate,
        };
      }
    } */

    if (user.role !== Role.ADMIN) {
      where.userId = user.id;
    }

    if (query.userId && user.role === Role.ADMIN) {
      where.userId = query.userId;
    }

    const { rows, count } = await this.shiftModel.findAndCountAll({
      where,
      include: {
        model: User,
        attributes: ['id', 'name', 'email', 'role'],
      },
      limit,
      offset,
      order: [[query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC']],
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async createManualShift(dto: ManualShiftDto): Promise<Shift> {
    const employee = await this.userModel.findByPk(dto.userId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if ((employee.role as Role) !== Role.EMPLOYEE) {
      throw new BadRequestException(
        'Manual shift can only be created for employees',
      );
    }

    const clockInAt = new Date(dto.clockInAt);
    const clockOutAt = new Date(dto.clockOutAt);

    if (clockOutAt <= clockInAt) {
      throw new BadRequestException(
        'Clock out time must be after clock in time',
      );
    }

    const overlappingShift = await this.shiftModel.findOne({
      where: {
        userId: dto.userId,
        [Op.or]: [
          {
            clockInAt: {
              [Op.between]: [clockInAt, clockOutAt],
            },
          },
          {
            clockOutAt: {
              [Op.between]: [clockInAt, clockOutAt],
            },
          },
          {
            [Op.and]: [
              {
                clockInAt: {
                  [Op.lte]: clockInAt,
                },
              },
              {
                clockOutAt: {
                  [Op.gte]: clockOutAt,
                },
              },
            ],
          },
        ],
      },
    });

    if (overlappingShift) {
      throw new ConflictException('Shift overlaps with an existing shift');
    }

    return await this.shiftModel.create({
      userId: dto.userId,
      clockInAt,
      clockOutAt,
      status: ShiftStatus.COMPLETED,
    } as Shift);
  }

  async getWeeklyWorkedHours(userId: string) {
    const now = new Date();

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay(); // 5
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);

    // start of week here
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const shifts = await this.shiftModel.findAll({
      where: {
        userId,
        clockInAt: {
          [Op.gte]: startOfWeek,
          [Op.lte]: endOfWeek,
        },
        status: ShiftStatus.COMPLETED,
      },
    });

    const totalMinutes = shifts.reduce((sum, shift) => {
      return (
        sum + this.calculateWorkedMinutes(shift.clockInAt, shift.clockOutAt)
      );
    }, 0);

    return {
      userId,
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
    };
  }

  async getEmployeeWorkedHours(
    userId: string,
    fromDate?: string,
    toDate?: string,
  ) {
    return this.getWorkedHours(userId, fromDate, toDate);
  }

  async getWorkedHours(userId?: string, fromDate?: string, toDate?: string) {
    const where: WhereOptions<Shift> = {
      status: ShiftStatus.COMPLETED,
    };

    if (userId) {
      where.userId = userId;
    }

    if (fromDate || toDate) {
      where.clockInAt = {};

      if (fromDate) {
        where.clockInAt[Op.gte] = new Date(fromDate);
      }

      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        where.clockInAt[Op.lte] = end;
      }
    }

    const shifts = await this.shiftModel.findAll({ where });

    const totalMinutes = shifts.reduce((sum, shift) => {
      return (
        sum + this.calculateWorkedMinutes(shift.clockInAt, shift.clockOutAt)
      );
    }, 0);

    return {
      userId: userId ?? null,
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
    };
  }

  async clockOut(userId: string) {
    const shift = await this.shiftModel.findOne({
      where: {
        userId,
        status: ShiftStatus.ACTIVE,
      },
    });

    if (!shift) {
      throw new BadRequestException('Your shift is not active');
    }

    await shift.update({
      clockOutAt: new Date(),
      status: ShiftStatus.COMPLETED,
    });
  }
}
