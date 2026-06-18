import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { User } from '../users/entities/user.entity';
import { GetActivityLogsQueryDto } from './dto/get-activity-logs-query.dto';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog)
    private readonly activityLogModel: typeof ActivityLog,
  ) {}

  async create(dto: CreateActivityLogDto): Promise<ActivityLog> {
    return this.activityLogModel.create({
      actorId: dto.actorId ?? null,
      action: dto.action,
      entityType: dto.entityType,
      entityId: dto.entityId ?? null,
      message: dto.message,
    });
  }

  async findAll(query: GetActivityLogsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions<ActivityLog> = {};

    if (query.action) {
      where.action = query.action;
    }

    if (query.entityType) {
      where.entityType = query.entityType;
    }

    if (query.actorId) {
      where.actorId = query.actorId;
    }

    if (query.fromDate || query.toDate) {
      const endDate = query.toDate ? new Date(query.toDate) : undefined;
      endDate?.setHours(23, 59, 59, 999);

      where.createdAt = {
        ...(query.fromDate ? { [Op.gte]: new Date(query.fromDate) } : {}),
        ...(endDate ? { [Op.lte]: endDate } : {}),
      };
    }

    const { rows, count } = await this.activityLogModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      distinct: true,
      limit,
      offset,
      order: [['createdAt', query.sortOrder ?? 'DESC']],
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

  async findRecent(limit = 10): Promise<ActivityLog[]> {
    return this.activityLogModel.findAll({
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async findRecentForUser(userId: string, limit = 10): Promise<ActivityLog[]> {
    return this.activityLogModel.findAll({
      where: {
        actorId: userId,
      },
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
    });
  }
}
