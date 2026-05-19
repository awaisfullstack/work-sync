import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const isExist = await this.departmentModel.findOne({
      where: { name: dto.name },
    });

    if (isExist) {
      throw new ConflictException('Department name already exists');
    }

    return await this.departmentModel.create(dto as any);
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

  async update(
    id: string,
    updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = this.findOne(id);

    if (updateDto.name) {
      const isExistSameName = await this.departmentModel.findOne({
        where: { name: updateDto.name },
      });

      if (isExistSameName && isExistSameName.id !== id) {
        throw new ConflictException('Department name already exists');
      }
    }
    await (await department).update(updateDto);

    return department;
  }

  async remove(id: string): Promise<null> {
    const department = await this.findOne(id);

    await department.destroy();

    return null;
  }
}
