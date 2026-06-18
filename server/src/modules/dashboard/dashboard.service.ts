import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { AuthenticatedUser } from '../../common/types/auth.types';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectStatus } from '../projects/enums/project-status.enum';
import { Shift } from '../shifts/entities/shift.entity';
import { ShiftStatus } from '../shifts/enums/shift-status.enum';
import { TaskAssignment } from '../tasks/entities/task-assignment.entity';
import { TaskStatus } from '../tasks/entities/task-status.entity';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatusName } from '../tasks/enums/task-status.enum';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/users.enum';

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

  async getDashboard(user: AuthenticatedUser) {
    if (user.role === Role.ADMIN) {
      return this.getAdminDashboard(user);
    }

    return this.getEmployeeDashboard(user);
  }

  private async getAdminDashboard(user: AuthenticatedUser) {
    const recentActivity = await this.activityLogsService.findRecent(6);

    const [
      totalUsers,
      totalEmployees,
      totalTasks,
      totalProjects,
      completedTasks,
      activeProjects,
      activeShifts,
      overdueTasks,
      weeklyWorkedHours,
    ] = await Promise.all([
      this.userModel.count(),
      this.userModel.count({ where: { role: Role.EMPLOYEE } }),
      this.taskModel.count(),
      this.projectModel.count(),
      this.countCompletedTasks(),
      this.countActiveProjects(),
      this.shiftModel.count({ where: { status: ShiftStatus.ACTIVE } }),
      this.countOverdueTasks(),
      this.getWeeklyWorkedHours(),
    ]);

    return {
      role: user.role,
      completedTasks,
      activeProjects,
      weeklyWorkedHours,
      recentActivity,
      stats: {
        totalUsers,
        totalEmployees,
        totalTasks,
        totalProjects,
        activeShifts,
        overdueTasks,
      },
    };
  }

  private async getEmployeeDashboard(user: AuthenticatedUser) {
    const [projectIds, taskIds] = await Promise.all([
      this.getUserProjectIds(user.id),
      this.getUserTaskIds(user.id),
    ]);

    const taskWhere = this.whereIdIn<Task>(taskIds);
    const projectWhere = this.whereIdIn<Project>(projectIds);

    const [recentActivity, activeShift, completedTasks, activeProjects] =
      await Promise.all([
        this.activityLogsService.findRecentForUser(user.id, 6),
        this.shiftModel.findOne({
          where: {
            userId: user.id,
            status: ShiftStatus.ACTIVE,
          },
          attributes: ['id', 'userId', 'clockInAt', 'clockOutAt', 'status'],
        }),
        this.countCompletedTasks(taskWhere),
        this.countActiveProjects(projectWhere),
      ]);

    const [weeklyWorkedHours, openTasks, overdueTasks, dueSoonTasks] =
      await Promise.all([
        this.getWeeklyWorkedHours(user.id),
        this.countOpenTasks(taskWhere),
        this.countOverdueTasks(taskWhere),
        this.countDueSoonTasks(taskWhere),
      ]);

    return {
      role: user.role,
      completedTasks,
      activeProjects,
      weeklyWorkedHours,
      recentActivity,
      activeShift,
      stats: {
        myProjects: projectIds.length,
        assignedTasks: taskIds.length,
        openTasks,
        overdueTasks,
        dueSoonTasks,
        hasActiveShift: Boolean(activeShift),
      },
    };
  }

  private async getUserProjectIds(userId: string) {
    const memberships = await this.projectMemberModel.findAll({
      where: { userId },
      attributes: ['projectId'],
    });

    return memberships.map((membership) => membership.projectId);
  }

  private async getUserTaskIds(userId: string) {
    const assignments = await this.taskAssignmentModel.findAll({
      where: {
        userId,
        unassignedAt: null,
      },
      attributes: ['taskId'],
    });

    return [...new Set(assignments.map((assignment) => assignment.taskId))];
  }

  private whereIdIn<TModel>(ids: string[]): WhereOptions<TModel> {
    return {
      id: {
        [Op.in]: ids,
      },
    } as WhereOptions<TModel>;
  }

  private async countActiveProjects(where: WhereOptions<Project> = {}) {
    return this.projectModel.count({
      where: {
        ...where,
        status: ProjectStatus.ACTIVE,
      },
    });
  }

  private async countCompletedTasks(where: WhereOptions<Task> = {}) {
    const completedStatus = await this.taskStatusModel.findOne({
      where: { name: TaskStatusName.COMPLETED },
      attributes: ['id'],
    });

    if (!completedStatus) {
      return 0;
    }

    return this.taskModel.count({
      where: {
        ...where,
        statusId: completedStatus.id,
      },
    });
  }

  private async countOpenTasks(where: WhereOptions<Task>) {
    const completedStatus = await this.taskStatusModel.findOne({
      where: { name: TaskStatusName.COMPLETED },
      attributes: ['id'],
    });

    if (!completedStatus) {
      return 0;
    }

    return this.taskModel.count({
      where: {
        ...where,
        statusId: {
          [Op.ne]: completedStatus.id,
        },
      },
    });
  }

  private countOverdueTasks(where: WhereOptions<Task> = {}) {
    return this.taskModel.count({
      where: {
        ...where,
        dueDate: {
          [Op.lt]: this.today(),
        },
      },
    });
  }

  private countDueSoonTasks(where: WhereOptions<Task>) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return this.taskModel.count({
      where: {
        ...where,
        dueDate: {
          [Op.gte]: this.today(),
          [Op.lte]: this.dateOnly(nextWeek),
        },
      },
    });
  }

  private async getWeeklyWorkedHours(userId?: string) {
    const weekStart = this.startOfWeek();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const shifts = await this.shiftModel.findAll({
      where: {
        ...(userId ? { userId } : {}),
        clockInAt: {
          [Op.gte]: weekStart,
          [Op.lt]: weekEnd,
        },
        clockOutAt: {
          [Op.ne]: null,
        },
      },
      attributes: ['clockInAt', 'clockOutAt'],
    });

    const hours = shifts.reduce((total, shift) => {
      if (!shift.clockOutAt) return total;

      return total + this.hoursBetween(shift.clockInAt, shift.clockOutAt);
    }, 0);

    return Number(hours.toFixed(2));
  }

  private startOfWeek() {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(now);

    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    return start;
  }

  private hoursBetween(start: Date, end: Date) {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  private today() {
    return this.dateOnly(new Date());
  }

  private dateOnly(date: Date) {
    return date.toISOString().split('T')[0];
  }
}
