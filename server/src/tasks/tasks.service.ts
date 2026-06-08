import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { TaskStatus, TaskStatusName } from './entities/task-status.entity';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskComment } from './entities/task-comment';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectMember } from 'src/projects/entities/project-member.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { AuthenticatedUser } from 'src/types';
import { AssignTaskDto } from './dto/assign-task.dto';
import { AddTaskCommentDto } from './dto/add-task-comment.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { Op, WhereOptions } from 'sequelize';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';
import {
  ActivityAction,
  ActivityEntityType,
} from 'src/activity-logs/entities/activity-log.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(TaskStatus)
    private readonly taskStatusModel: typeof TaskStatus,

    @InjectModel(TaskAssignment)
    private readonly taskAssignmentModel: typeof TaskAssignment,

    @InjectModel(TaskComment)
    private readonly taskCommentModel: typeof TaskComment,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private readonly projectMemberModel: typeof ProjectMember,

    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly activityLogsService: ActivityLogsService,
  ) {}

  private isAdmin(user: AuthenticatedUser): boolean {
    return user.role === UserRole.ADMIN;
  }

  private async getStatusByName(status: TaskStatusName): Promise<TaskStatus> {
    const taskStatus = await this.taskStatusModel.findOne({
      where: { name: status },
    });

    if (!taskStatus) {
      throw new BadRequestException(`Task status ${status} does not exist`);
    }

    return taskStatus;
  }

  private async ensureProjectExists(projectId: string): Promise<Project> {
    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private async ensureUserExists(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('Assigned user not found');
    }

    return user;
  }

  private async ensureUserIsProjectMember(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.projectMemberModel.findOne({
      where: {
        projectId,
        userId,
      },
    });

    if (!member) {
      throw new BadRequestException(
        'Assigned user must be a member of this project',
      );
    }
  }

  private async ensureTaskAccess(
    task: Task,
    user: AuthenticatedUser,
  ): Promise<void> {
    if (this.isAdmin(user)) return;

    const member = await this.projectMemberModel.findOne({
      where: {
        projectId: task.projectId,
        userId: user.id,
      },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }

  async create(
    createTaskDto: CreateTaskDto,
    user: AuthenticatedUser,
  ): Promise<Task> {
    const { title, description, dueDate, projectId, assignedUserId } =
      createTaskDto;
    await this.ensureProjectExists(projectId);

    if (assignedUserId) {
      await this.ensureUserExists(assignedUserId);
      await this.ensureUserIsProjectMember(projectId, assignedUserId);
    }

    const todoStatus = await this.getStatusByName(TaskStatusName.TODO);
    const task = await this.taskModel.create({
      title,
      description: description ?? null,
      dueDate,
      projectId,
      createdBy: user.id,
      statusId: todoStatus.id,
    });

    await this.activityLogsService.create({
      actorId: user.id,
      action: ActivityAction.TASK_CREATED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      projectId: task.projectId,
      message: `Task "${task.title}" was created.`,
      metadata: {
        title: task.title,
        dueDate: task.dueDate,
      },
    });

    if (assignedUserId) {
      await this.taskAssignmentModel.create({
        userId: assignedUserId,
        taskId: task.id,
        assignedBy: user.id,
      } as TaskAssignment);

      await this.activityLogsService.create({
        actorId: user.id,
        action: ActivityAction.TASK_ASSIGNED,
        entityType: ActivityEntityType.TASK,
        entityId: task.id,
        projectId: task.projectId,
        message: `A user was assigned to task "${task.title}".`,
        metadata: {
          assignedUserId,
        },
      });
    }

    return this.findOne(task.id, user);
  }

  async findAll(query: GetTasksQueryDto, user: AuthenticatedUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const taskWhere: WhereOptions<Task> = {};

    if (query.search) {
      Object.assign(taskWhere, {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
        ],
      });
    }

    if (query.projectId) {
      taskWhere.projectId = query.projectId;
    }

    if (query.fromDate || query.toDate) {
      taskWhere.dueDate = {
        ...(query.fromDate ? { [Op.gte]: query.fromDate } : {}),
        ...(query.toDate ? { [Op.lte]: query.toDate } : {}),
      };
    }

    const include = [
      {
        model: TaskStatus,
        attributes: ['id', 'name'],
        ...(query.status
          ? {
              where: {
                name: query.status,
              },
            }
          : {}),
      },
      {
        model: Project,
        attributes: ['id', 'title'],
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email'],
      },
    ];

    if (!this.isAdmin(user)) {
      const memberships = await this.taskAssignmentModel.findAll({
        where: { userId: user.id },
        attributes: ['taskId'],
      });

      const taskIds = memberships.map((member) => member.taskId);

      if (taskIds.length === 0) {
        return {
          items: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        };
      }

      taskWhere.id = {
        [Op.in]: taskIds,
      };
    }

    const { rows, count } = await this.taskModel.findAndCountAll({
      where: taskWhere,
      attributes: {
        exclude: ['statusId', 'projectId', 'createdBy'],
      },
      include,
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

  async findOne(id: string, user: AuthenticatedUser): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      include: [
        {
          model: TaskStatus,
          attributes: ['id', 'name'],
        },
        {
          model: Project,
          attributes: ['id', 'title', 'status'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: TaskAssignment,
          where: {
            unassignedAt: null,
          },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureTaskAccess(task, user);

    return task;
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    user: AuthenticatedUser,
  ): Promise<Task> {
    const task = await this.findOne(taskId, user);

    const { title, description, dueDate } = updateTaskDto;
    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      dueDate: dueDate ?? task.dueDate,
    });

    return this.findOne(taskId, user);
  }

  async updateStatus(
    id: string,
    status: TaskStatusName,
    user: AuthenticatedUser,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    const taskStatus = await this.getStatusByName(status);

    await task.update({
      statusId: taskStatus.id,
    });

    await this.activityLogsService.create({
      actorId: user.id,
      action: ActivityAction.TASK_STATUS_UPDATED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      projectId: task.projectId,
      message: `Task "${task.title}" status was updated to ${status}.`,
      metadata: {
        status,
      },
    });

    return this.findOne(id, user);
  }

  async assign(taskId: string, dto: AssignTaskDto, user: AuthenticatedUser) {
    const task = await this.findOne(taskId, user);

    await this.ensureUserExists(dto.userId);
    await this.ensureUserIsProjectMember(task.projectId, dto.userId);

    const isAlreadyAssigned = await this.taskAssignmentModel.findOne({
      where: {
        taskId,
        userId: dto.userId,
        unassignedAt: null,
      },
    });

    if (isAlreadyAssigned) {
      throw new BadRequestException('User is already assigned to this task');
    }

    await this.taskAssignmentModel.create({
      taskId: task.id,
      userId: dto.userId,
      assignedBy: user.id,
    } as TaskAssignment);

    await this.activityLogsService.create({
      actorId: user.id,
      action: ActivityAction.TASK_ASSIGNED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      projectId: task.projectId,
      message: `A user was assigned to task "${task.title}".`,
      metadata: {
        assignedUserId: dto.userId,
      },
    });

    return this.findOne(taskId, user);
  }

  async unassign(
    taskId: string,
    userId: string,
    user: AuthenticatedUser,
  ): Promise<Task> {
    const task = await this.findOne(taskId, user);

    const assignment = await this.taskAssignmentModel.findOne({
      where: {
        taskId,
        userId,
        unassignedAt: null,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Active assignment not found');
    }

    await assignment.update({
      unassignedAt: new Date(),
    });

    return this.findOne(task.id, user);
  }

  async addComment(
    taskId: string,
    dto: AddTaskCommentDto,
    user: AuthenticatedUser,
  ): Promise<TaskComment> {
    const task = await this.findOne(taskId, user);

    const comment = await this.taskCommentModel.create({
      taskId: task.id,
      userId: user.id,
      comment: dto.comment,
    } as TaskComment);

    await this.activityLogsService.create({
      actorId: user.id,
      action: ActivityAction.TASK_COMMENT_ADDED,
      entityType: ActivityEntityType.TASK_COMMENT,
      entityId: comment.id,
      projectId: task.projectId,
      message: `A comment was added on task "${task.title}".`,
      metadata: {
        taskId: task.id,
      },
    });

    return comment;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const task = await this.findOne(id, user);

    await task.destroy();
  }

  async getTaskComments(taskId: string, user: AuthenticatedUser) {
    const task = await this.findOne(taskId, user);

    const comments = await this.taskCommentModel.findAll({
      where: {
        taskId: task.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return comments;
  }

  async deleteTaskComment(
    taskId: string,
    commentId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const task = await this.findOne(taskId, user);

    const comment = await this.taskCommentModel.findOne({
      where: {
        id: commentId,
        taskId: task.id,
      },
    });

    if (!comment) {
      throw new NotFoundException('Task comment not found');
    }

    const isCommentOwner = comment.userId === user.id;

    if (!this.isAdmin(user) && !isCommentOwner) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    await comment.destroy();

    await this.activityLogsService.create({
      actorId: user.id,
      action: ActivityAction.TASK_COMMENT_DELETED,
      entityType: ActivityEntityType.TASK_COMMENT,
      entityId: comment.id,
      projectId: task.projectId,
      message: `A comment was deleted from task "${task.title}".`,
      metadata: {
        taskId: task.id,
        commentId: comment.id,
      },
    });
  }
}
