import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existingDepartment = await this.departmentModel.findOne({
      where: { name: dto.name },
    });

    if (existingDepartment) {
      throw new ConflictException('Department name already exists');
    }

    return this.departmentModel.create(dto);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel.findByPk(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<null> {
    const department = await this.findOne(id);

    if (dto.name) {
      const existingDepartment = await this.departmentModel.findOne({
        where: { name: dto.name },
      });

      if (existingDepartment && existingDepartment.id !== id) {
        throw new ConflictException('Department name already exists');
      }
    }

    await department.update(dto);

    return null;
  }
}
