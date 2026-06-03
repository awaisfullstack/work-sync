import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
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

  async create(dto: CreateUserDto): Promise<User> {
    const { email, password, departmentId, role } = dto;
    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userRole = role ?? UserRole.EMPLOYEE;

    if (!departmentId && userRole === UserRole.EMPLOYEE) {
      throw new BadRequestException('Department is required for employee user');
    }

    if (departmentId) {
      const department = await this.departmentModel.findByPk(departmentId);

      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...dto,
      role: userRole,
      password: hashedPassword,
      departmentId: departmentId ?? null,
    });

    return this.findOne(user.id);
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
        exclude: ['password'],
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

  async findUserOptions() {
    return this.userModel.findAll({
      where: {
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
      attributes: ['id', 'name', 'email', 'role', 'departmentId'],
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'departmentId', 'createdAt', 'updatedAt'],
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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

    if (updateUserDto.role === UserRole.EMPLOYEE) {
      const finalDepartmentId = updateUserDto.departmentId ?? user.departmentId;

      if (!finalDepartmentId) {
        throw new BadRequestException(
          'Department is required for employee user',
        );
      }
    }

    await user.update(updateUserDto);

    return this.findOne(id);
  }

  async deactivate(id: string): Promise<{ id: string; isActive: boolean }> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      isActive: false,
    });

    return {
      id: user.id,
      isActive: user.isActive,
    };
  }

  async activate(id: string): Promise<{ id: string; isActive: boolean }> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      isActive: true,
    });

    return {
      id: user.id,
      isActive: user.isActive,
    };
  }
}
