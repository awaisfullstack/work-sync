import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Department } from './entities/department.entity';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
@ApiBearerAuth('access-token')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ResponseMessage('Department created successfully')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ResponseMessage('Department updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return await this.departmentsService.update(id, updateDepartmentDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ResponseMessage('Department deleted successfully')
  async remove(@Param('id') id: string): Promise<null> {
    return await this.departmentsService.remove(id);
  }
}
