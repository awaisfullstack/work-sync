import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import {
  ActivityAction,
  ActivityEntityType,
} from '../activity-logs/entities/activity-log.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,

    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(dto: CreateDepartmentDto, actorId: string): Promise<null> {
    const existingDepartment = await this.departmentModel.findOne({
      where: { name: dto.name },
    });

    if (existingDepartment) {
      throw new ConflictException('Department name already exists');
    }

    const department = await this.departmentModel.create(dto);

    await this.activityLogsService.create({
      actorId,
      action: ActivityAction.DEPARTMENT_CREATED,
      entityType: ActivityEntityType.DEPARTMENT,
      entityId: department.id,
      message: `Department "${department.name}" was created.`,
    });

    return null;
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
    dto: UpdateDepartmentDto,
    actorId: string,
  ): Promise<null> {
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

    await this.activityLogsService.create({
      actorId,
      action: ActivityAction.DEPARTMENT_UPDATED,
      entityType: ActivityEntityType.DEPARTMENT,
      entityId: department.id,
      message: `Department "${department.name}" was updated.`,
    });

    return null;
  }
}
