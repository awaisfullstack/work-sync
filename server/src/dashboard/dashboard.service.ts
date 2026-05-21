import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { UserRole } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { AuthenticatedUser } from 'src/types';
import {
  TaskStatus,
  TaskStatusName,
} from 'src/tasks/entities/task-status.entity';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';
import { ProjectStatus } from 'src/projects/enums/project-status.enum';

type DateRange = {
  start: Date;
  end: Date;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(TaskStatus)
    private readonly taskStatusModel: typeof TaskStatus,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(Shift)
    private readonly shiftModel: typeof Shift,

    private readonly activityLogsService: ActivityLogsService,
  ) {}

  private isAdmin(user: AuthenticatedUser): boolean {
    return user.role === UserRole.ADMIN;
  }

  private getCurrentWeekRange(): DateRange {
    const now = new Date();

    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    end.setHours(0, 0, 0, 0);

    return { start, end };
  }

  private calculateHours(clockInAt: Date, clockOutAt: Date): number {
    const milliseconds = clockOutAt.getTime() - clockInAt.getTime();
    return milliseconds / (1000 * 60 * 60);
  }
  async getDashboard(authUser: AuthenticatedUser) {
    const weekRange = this.getCurrentWeekRange();

    const completedStatus = await this.taskStatusModel.findOne({
      where: {
        name: TaskStatusName.COMPLETED,
      },
    });

    const totalCompletedTasks = completedStatus
      ? await this.taskModel.count({
          where: {
            statusId: completedStatus.id,
          },
        })
      : 0;

    const totalActiveProjects = await this.projectModel.count({
      where: {
        status: ProjectStatus.ACTIVE,
      },
    });

    const shiftWhere = this.isAdmin(authUser)
      ? {
          clockInAt: {
            [Op.gte]: weekRange.start,
            [Op.lt]: weekRange.end,
          },
          clockOutAt: {
            [Op.ne]: null,
          },
        }
      : {
          userId: authUser.id,
          clockInAt: {
            [Op.gte]: weekRange.start,
            [Op.lt]: weekRange.end,
          },
          clockOutAt: {
            [Op.ne]: null,
          },
        };

    const weeklyShifts = await this.shiftModel.findAll({
      where: shiftWhere,
      attributes: ['id', 'userId', 'clockInAt', 'clockOutAt'],
    });

    const weeklyWorkedHours = weeklyShifts.reduce((total, shift) => {
      if (!shift.clockOutAt) return total;

      return total + this.calculateHours(shift.clockInAt, shift.clockOutAt);
    }, 0);

    const taskStatusSummary = await this.getTaskStatusSummary();
    const projectStatusSummary = await this.getProjectStatusSummary();
    const recentActivity = await this.activityLogsService.findRecent(10);

    return {
      totalCompletedTasks,
      totalActiveProjects,
      weeklyWorkedHours: Number(weeklyWorkedHours.toFixed(2)),
      taskStatusSummary,
      projectStatusSummary,
      recentActivity,
    };
  }

  private async getTaskStatusSummary() {
    const statuses = await this.taskStatusModel.findAll({
      attributes: ['id', 'name'],
    });

    const result: { status: TaskStatusName; count: number }[] = [];

    for (const status of statuses) {
      const count = await this.taskModel.count({
        where: {
          statusId: status.id,
        },
      });

      result.push({
        status: status.name,
        count,
      });
    }

    return result;
  }

  private async getProjectStatusSummary() {
    const activeProjects = await this.projectModel.count({
      where: {
        status: ProjectStatus.ACTIVE,
      },
    });

    const archivedProjects = await this.projectModel.count({
      where: {
        status: ProjectStatus.ARCHIVED,
      },
    });

    return [
      {
        status: 'ACTIVE',
        count: activeProjects,
      },
      {
        status: 'ARCHIVED',
        count: archivedProjects,
      },
    ];
  }
}
