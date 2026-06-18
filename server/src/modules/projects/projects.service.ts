import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/users.enum';
import { ProjectStatus } from './enums/project-status.enum';
import { ProjectQueryDto } from './dto/project-query.dto';
import { Includeable, literal, Op, WhereOptions } from 'sequelize';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { AuthenticatedUser } from '../../common/types/auth.types';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import {
  ActivityAction,
  ActivityEntityType,
} from '../activity-logs/entities/activity-log.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private readonly projectMemberModel: typeof ProjectMember,

    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(dto: CreateProjectDto, createdById: string): Promise<null> {
    const project = await this.projectModel.create({
      title: dto.title,
      description: dto.description ?? null,
      createdById,
      status: dto.status ?? ProjectStatus.ACTIVE,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
    });

    await this.activityLogsService.create({
      actorId: createdById,
      action: ActivityAction.PROJECT_CREATED,
      entityType: ActivityEntityType.PROJECT,
      entityId: project.id,
      message: `Project "${project.title}" was created.`,
    });

    return null;
  }

  async findAll(query: ProjectQueryDto, user: AuthenticatedUser) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions<Project> = {};
    if (query.search) {
      Object.assign(where, {
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

    if (query.status) {
      where.status = query.status;
    }

    const include: Includeable[] = [
      {
        model: User,
        as: 'createdBy',
        attributes: ['id', 'name', 'email', 'role'],
      },
    ];

    if (user.role === Role.EMPLOYEE) {
      include.push({
        model: ProjectMember,
        as: 'members',
        required: true,
        where: {
          userId: user.id,
        },
        attributes: [],
      });
    }

    const { rows, count } = await this.projectModel.findAndCountAll({
      where,
      attributes: {
        include: [
          [
            literal(`(
            SELECT COUNT(*)
            FROM project_members AS pm
            WHERE pm.project_id = "Project"."id"
          )`),
            'membersCount',
          ],
        ],
      },
      limit,
      offset,
      order: [[query.sortBy || 'createdAt', query.sortOrder || 'DESC']],
      include,
      distinct: true,
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

  async findProjectOptions(
    user: AuthenticatedUser,
  ): Promise<Pick<Project, 'id' | 'title'>[]> {
    const where: WhereOptions<Project> = {};

    if (user.role === Role.EMPLOYEE) {
      return this.projectModel.findAll({
        attributes: ['id', 'title'],
        include: [
          {
            model: ProjectMember,
            as: 'members',
            attributes: [],
            where: {
              userId: user.id,
            },
            required: true,
          },
        ],
        where,
        order: [['title', 'ASC']],
      });
    }

    return this.projectModel.findAll({
      attributes: ['id', 'title'],
      where,
      order: [['title', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: ProjectMember,
          as: 'members',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'role'],
            },
          ],
        },
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    actorId: string,
  ): Promise<null> {
    const project = await this.findOne(id);

    await project.update({
      title: dto.title ?? project.title,
      description: dto.description ?? project.description,
      status: dto.status ?? project.status,
      deadline: dto.deadline ? new Date(dto.deadline) : project.deadline,
    });

    await this.activityLogsService.create({
      actorId,
      action: ActivityAction.PROJECT_UPDATED,
      entityType: ActivityEntityType.PROJECT,
      entityId: project.id,
      message: `Project "${project.title}" was updated.`,
    });

    return null;
  }

  async archive(id: string, actorId: string): Promise<null> {
    const project = await this.findOne(id);

    await project.update({
      status: ProjectStatus.ARCHIVED,
      archivedAt: new Date(),
    });

    await this.activityLogsService.create({
      actorId,
      action: ActivityAction.PROJECT_ARCHIVED,
      entityType: ActivityEntityType.PROJECT,
      entityId: project.id,
      message: `Project "${project.title}" was archived.`,
    });

    return null;
  }

  async addMember(
    projectId: string,
    dto: AddProjectMemberDto,
    actorId: string,
  ): Promise<null> {
    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userModel.findByPk(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if ((user.role as Role) !== Role.EMPLOYEE) {
      throw new ForbiddenException(
        'Only employees can be assigned to projects',
      );
    }

    const alreadyMember = await this.projectMemberModel.findOne({
      where: {
        projectId,
        userId: dto.userId,
      },
    });

    if (alreadyMember) {
      throw new ConflictException('User is already a member of this project');
    }

    await this.projectMemberModel.create({
      projectId,
      userId: dto.userId,
      roleInProject: dto.roleInProject,
      joinedAt: new Date(),
    });

    await this.activityLogsService.create({
      actorId,
      action: ActivityAction.PROJECT_MEMBER_ADDED,
      entityType: ActivityEntityType.PROJECT,
      entityId: project.id,
      message: `A member was added to project "${project.title}".`,
    });

    return null;
  }

  async removeMember(
    projectId: string,
    userId: string,
    actorId: string,
  ): Promise<null> {
    const member = await this.projectMemberModel.findOne({
      where: {
        projectId,
        userId,
      },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title'],
        },
      ],
    });

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    const projectTitle = member.project?.title ?? 'Unknown project';

    await member.destroy();

    await this.activityLogsService.create({
      actorId,
      action: ActivityAction.PROJECT_MEMBER_REMOVED,
      entityType: ActivityEntityType.PROJECT,
      entityId: projectId,
      message: `A member was removed from project "${projectTitle}".`,
    });

    return null;
  }

  async ensureEmployeeCanAccessProject(
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
      throw new ForbiddenException('You do not have access to this project');
    }
  }
}
