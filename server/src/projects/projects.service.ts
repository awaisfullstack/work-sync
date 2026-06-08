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
import { User, UserRole } from 'src/users/entities/user.entity';
import { ProjectStatus } from './enums/project-status.enum';
import { ProjectQueryDto } from './dto/project-query.dto';
import { Includeable, Op, WhereOptions } from 'sequelize';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { AuthenticatedUser } from 'src/types';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private readonly projectMemberModel: typeof ProjectMember,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(dto: CreateProjectDto, createdById: string): Promise<Project> {
    return await this.projectModel.create({
      title: dto.title,
      description: dto.description ?? null,
      createdById,
      status: dto.status ?? ProjectStatus.ACTIVE,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
    });
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

    if (user.role === UserRole.EMPLOYEE) {
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
      limit,
      offset,
      order: [[query.sortBy || 'createdAt', query.sortOrder || 'DESC']],
      include,
      distinct: true,
    });

    const projectIds = rows.map((project) => project.id);
    const projectMembers = projectIds.length
      ? await this.projectMemberModel.findAll({
          where: {
            projectId: {
              [Op.in]: projectIds,
            },
          },
          attributes: ['id', 'projectId', 'userId'],
          raw: true,
        })
      : [];

    const membersByProjectId = projectMembers.reduce<
      Record<string, { id: string; projectId: string; userId: string }[]>
    >((acc, member) => {
      acc[member.projectId] ??= [];
      acc[member.projectId].push(member);

      return acc;
    }, {});
    console.log('membersByProjectId', membersByProjectId);

    const items = rows.map((project) => {
      const members = membersByProjectId[project.id] ?? [];

      return {
        ...project.toJSON(),
        membersCount: members.length,
      };
    });

    return {
      items,
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

    if (user.role === UserRole.EMPLOYEE) {
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

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    await project.update({
      title: dto.title ?? project.title,
      description: dto.description ?? project.description,
      status: dto.status ?? project.status,
      deadline: dto.deadline ? new Date(dto.deadline) : project.deadline,
    });

    return project;
  }

  async archive(id: string): Promise<Project> {
    const project = await this.findOne(id);

    await project.update({
      status: ProjectStatus.ARCHIVED,
      archivedAt: new Date(),
    });

    return project;
  }

  async addMember(
    projectId: string,
    dto: AddProjectMemberDto,
  ): Promise<ProjectMember> {
    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userModel.findByPk(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== (UserRole.EMPLOYEE as unknown as typeof user.role)) {
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

    return this.projectMemberModel.create({
      projectId,
      userId: dto.userId,
      roleInProject: dto.roleInProject,
      joinedAt: new Date(),
    } as ProjectMember);
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    const member = await this.projectMemberModel.findOne({
      where: {
        projectId,
        userId,
      },
    });

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    await member.destroy();
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.projectMemberModel.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
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
