import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
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
      projectId: dto.projectId ?? null,
      message: dto.message,
      metadata: dto.metadata ?? null,
    } as ActivityLog);
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

    if (query.projectId) {
      where.projectId = query.projectId;
    }

    if (query.fromDate || query.toDate) {
      where.createdAt = {
        ...(query.fromDate ? { [Op.gte]: new Date(query.fromDate) } : {}),
        ...(query.toDate ? { [Op.lte]: new Date(query.toDate) } : {}),
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
        {
          model: Project,
          attributes: ['id', 'title', 'status'],
        },
      ],
      distinct: true,
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

  async findRecent(limit = 10): Promise<ActivityLog[]> {
    return this.activityLogModel.findAll({
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: Project,
          attributes: ['id', 'title', 'status'],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
    });
  }
}
