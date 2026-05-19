import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Department } from './entities/department.entity';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ResponseMessage('Department created successfully')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Department updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return await this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @ResponseMessage('Department deleted successfully')
  async remove(@Param('id') id: string): Promise<null> {
    return await this.departmentsService.remove(id);
  }
}
