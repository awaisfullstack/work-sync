import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { User, UserRole } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { Shift, ShiftStatus } from '../shifts/entities/shift.entity';
import { AuthenticatedUser } from '../../common/types/auth.types';
import {
  TaskStatus,
  TaskStatusName,
} from '../tasks/entities/task-status.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ProjectStatus } from '../projects/enums/project-status.enum';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { TaskAssignment } from '../tasks/entities/task-assignment.entity';

type DateRange = {
  start: Date;
  end: Date;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(TaskStatus)
    private readonly taskStatusModel: typeof TaskStatus,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private readonly projectMemberModel: typeof ProjectMember,

    @InjectModel(TaskAssignment)
    private readonly taskAssignmentModel: typeof TaskAssignment,

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

  private formatDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async getDashboard(authUser: AuthenticatedUser) {
    if (this.isAdmin(authUser)) {
      return this.getAdminDashboard(authUser);
    }

    return this.getEmployeeDashboard(authUser);
  }

  private async getAdminDashboard(authUser: AuthenticatedUser) {
    const weekRange = this.getCurrentWeekRange();
    const taskStatusSummary = await this.getTaskStatusSummary();
    const projectStatusSummary = await this.getProjectStatusSummary();

    const totalUsers = await this.userModel.count();
    const totalEmployees = await this.userModel.count({
      where: {
        role: UserRole.EMPLOYEE,
      },
    });
    const activeEmployees = await this.userModel.count({
      where: {
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
    });
    const totalTasks = await this.taskModel.count();
    const totalProjects = await this.projectModel.count();
    const totalActiveProjects = this.getSummaryCount(
      projectStatusSummary,
      ProjectStatus.ACTIVE,
    );
    const totalCompletedTasks = this.getSummaryCount(
      taskStatusSummary,
      TaskStatusName.COMPLETED,
    );
    const overdueTasks = await this.countTasks({
      dueDate: {
        [Op.lt]: this.formatDateOnly(new Date()),
      },
    });
    const activeShifts = await this.shiftModel.count({
      where: {
        status: ShiftStatus.ACTIVE,
      },
    });

    const weeklyShifts = await this.shiftModel.findAll({
      where: {
        clockInAt: {
          [Op.gte]: weekRange.start,
          [Op.lt]: weekRange.end,
        },
        clockOutAt: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'userId', 'clockInAt', 'clockOutAt'],
    });
    const recentActivity = await this.activityLogsService.findRecent(10);
    const weeklyWorkedHours = this.getWorkedHoursFromShifts(weeklyShifts);

    return {
      role: authUser.role,
      totalCompletedTasks,
      totalActiveProjects,
      weeklyWorkedHours,
      stats: {
        totalUsers,
        totalEmployees,
        activeEmployees,
        totalTasks,
        totalCompletedTasks,
        totalActiveProjects,
        totalProjects,
        overdueTasks,
        activeShifts,
      },
      taskStatusSummary,
      projectStatusSummary,
      recentActivity,
    };
  }

  private async getEmployeeDashboard(authUser: AuthenticatedUser) {
    const weekRange = this.getCurrentWeekRange();
    const today = this.formatDateOnly(new Date());
    const memberships = await this.projectMemberModel.findAll({
      where: {
        userId: authUser.id,
      },
      attributes: ['projectId'],
    });
    const projectIds = memberships.map((membership) => membership.projectId);
    const activeAssignments = await this.taskAssignmentModel.findAll({
      where: {
        userId: authUser.id,
        unassignedAt: null,
      },
      attributes: ['taskId'],
    });
    const assignedTaskIds = [
      ...new Set(activeAssignments.map((assignment) => assignment.taskId)),
    ];
    const assignedTaskWhere = this.getAssignedTaskWhere(assignedTaskIds);
    const projectWhere = this.getProjectScopeWhere(projectIds);
    const taskStatusSummary =
      await this.getTaskStatusSummary(assignedTaskWhere);
    const projectStatusSummary =
      await this.getProjectStatusSummary(projectWhere);
    const totalCompletedTasks = this.getSummaryCount(
      taskStatusSummary,
      TaskStatusName.COMPLETED,
    );
    const totalActiveProjects = this.getSummaryCount(
      projectStatusSummary,
      ProjectStatus.ACTIVE,
    );
    const myAssignedTasks = assignedTaskIds.length;
    const myOpenTasks =
      this.getSummaryCount(taskStatusSummary, TaskStatusName.TODO) +
      this.getSummaryCount(taskStatusSummary, TaskStatusName.IN_PROGRESS);
    const overdueTasks = await this.countTasks({
      ...assignedTaskWhere,
      dueDate: {
        [Op.lt]: today,
      },
    });
    const dueSoonTasks = await this.countTasks({
      ...assignedTaskWhere,
      dueDate: {
        [Op.gte]: today,
        [Op.lte]: this.formatDateOnly(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ),
      },
    });
    const activeShift = await this.shiftModel.findOne({
      where: {
        userId: authUser.id,
        status: ShiftStatus.ACTIVE,
      },
      attributes: ['id', 'userId', 'clockInAt', 'clockOutAt', 'status'],
    });
    const weeklyShifts = await this.shiftModel.findAll({
      where: {
        userId: authUser.id,
        clockInAt: {
          [Op.gte]: weekRange.start,
          [Op.lt]: weekRange.end,
        },
        clockOutAt: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'userId', 'clockInAt', 'clockOutAt'],
    });
    const recentActivity = await this.activityLogsService.findRecentForUser(
      authUser.id,
      projectIds,
      10,
    );
    const weeklyWorkedHours = this.getWorkedHoursFromShifts(weeklyShifts);

    return {
      role: authUser.role,
      totalCompletedTasks,
      totalActiveProjects,
      weeklyWorkedHours,
      stats: {
        myProjects: projectIds.length,
        myActiveProjects: totalActiveProjects,
        myAssignedTasks,
        myOpenTasks,
        myCompletedTasks: totalCompletedTasks,
        overdueTasks,
        dueSoonTasks,
        hasActiveShift: Boolean(activeShift),
      },
      activeShift,
      taskStatusSummary,
      projectStatusSummary,
      recentActivity,
    };
  }

  private getWorkedHoursFromShifts(shifts: Shift[]): number {
    const weeklyWorkedHours = shifts.reduce((total, shift) => {
      if (!shift.clockOutAt) return total;

      return total + this.calculateHours(shift.clockInAt, shift.clockOutAt);
    }, 0);

    return Number(weeklyWorkedHours.toFixed(2));
  }

  private getSummaryCount<TStatus extends string>(
    summary: { status: TStatus; count: number }[],
    status: TStatus,
  ) {
    return summary.find((item) => item.status === status)?.count ?? 0;
  }

  private getAssignedTaskWhere(taskIds: string[]): WhereOptions<Task> {
    if (taskIds.length === 0) {
      return {
        id: {
          [Op.in]: [],
        },
      };
    }

    return {
      id: {
        [Op.in]: taskIds,
      },
    };
  }

  private getProjectScopeWhere(projectIds: string[]): WhereOptions<Project> {
    if (projectIds.length === 0) {
      return {
        id: {
          [Op.in]: [],
        },
      };
    }

    return {
      id: {
        [Op.in]: projectIds,
      },
    };
  }

  private async countTasks(where: WhereOptions<Task>) {
    return this.taskModel.count({ where });
  }

  private async getTaskStatusSummary(taskWhere: WhereOptions<Task> = {}) {
    const statuses = await this.taskStatusModel.findAll({
      attributes: ['id', 'name'],
    });

    const result: { status: TaskStatusName; count: number }[] = [];

    for (const status of statuses) {
      const count = await this.taskModel.count({
        where: {
          ...taskWhere,
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

  private async getProjectStatusSummary(
    projectWhere: WhereOptions<Project> = {},
  ) {
    const activeProjects = await this.projectModel.count({
      where: {
        ...projectWhere,
        status: ProjectStatus.ACTIVE,
      },
    });

    const archivedProjects = await this.projectModel.count({
      where: {
        ...projectWhere,
        status: ProjectStatus.ARCHIVED,
      },
    });

    const completedProjects = await this.projectModel.count({
      where: {
        ...projectWhere,
        status: ProjectStatus.COMPLETED,
      },
    });

    return [
      {
        status: 'ACTIVE',
        count: activeProjects,
      },
      {
        status: 'COMPLETED',
        count: completedProjects,
      },
      {
        status: 'ARCHIVED',
        count: archivedProjects,
      },
    ];
  }
}
