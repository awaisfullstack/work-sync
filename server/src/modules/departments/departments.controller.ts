import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Department } from './entities/department.entity';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../users/enums/users.enum';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
@ApiTags('Departments')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a department' })
  @ResponseMessage('Department created successfully')
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.departmentsService.create(createDepartmentDto, user.id);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List departments' })
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get one department by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ResponseMessage('Department updated successfully')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return await this.departmentsService.update(
      id,
      updateDepartmentDto,
      user.id,
    );
  }
}
