import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from './enums/users.enum';
import { Department } from '../departments/entities/department.entity';
import * as bcrypt from 'bcrypt';
import { QueryUsersDto } from './dto/query-users.dto';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async create(dto: CreateUserDto): Promise<null> {
    const { email, password, departmentId, role } = dto;
    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userRole = role ?? Role.EMPLOYEE;

    if (!departmentId && userRole === Role.EMPLOYEE) {
      throw new BadRequestException('Department is required for employee user');
    }

    if (departmentId) {
      const department = await this.departmentModel.findByPk(departmentId);

      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.create({
      ...dto,
      role: userRole,
      password: hashedPassword,
      departmentId: departmentId ?? null,
      isActive: true,
    });

    return null;
  }

  async findAll(query: QueryUsersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const offset = (page - 1) * limit;
    const where: WhereOptions<User> = {};

    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
        ],
      });
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      attributes: {
        exclude: ['password', 'departmentId'],
      },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
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

  async getUserStats() {
    const [totalUsers, totalAdmins, totalEmployees] = await Promise.all([
      this.userModel.count(),

      this.userModel.count({
        where: {
          role: Role.ADMIN,
        },
      }),

      this.userModel.count({
        where: {
          role: Role.EMPLOYEE,
        },
      }),
    ]);

    return {
      totalUsers,
      totalAdmins,
      totalEmployees,
    };
  }

  async findUserOptions() {
    return this.userModel.findAll({
      where: {
        role: Role.EMPLOYEE,
        isActive: true,
      },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'departmentId'],
      },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<null> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    if (updateUserDto.departmentId) {
      const department = await this.departmentModel.findByPk(
        updateUserDto.departmentId,
      );

      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }

    if (updateUserDto.role === Role.EMPLOYEE) {
      const finalDepartmentId = updateUserDto.departmentId;

      if (!finalDepartmentId) {
        throw new BadRequestException(
          'Department is required for employee user',
        );
      }
    }

    await user.update(updateUserDto);

    return null;
  }

  async deactivate(id: string): Promise<null> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      isActive: false,
    });

    return null;
  }

  async activate(id: string): Promise<null> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      isActive: true,
    });

    return null;
  }

  async remove(id: string): Promise<null> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.destroy();

    return null;
  }
}
