import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/types/auth.types';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../users/enums/users.enum';
import { ProjectQueryDto } from './dto/project-query.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard)
@Controller('projects')
@ApiTags('Projects')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a project' })
  @ResponseMessage('Project created successfully')
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({ summary: 'List projects visible to current user' })
  findAll(
    @Query() query: ProjectQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.findAll(query, user);
  }

  @Get('options')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get project options for select inputs' })
  findProjectOptions(@CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.findProjectOptions(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one project by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === Role.EMPLOYEE) {
      await this.projectsService.ensureEmployeeCanAccessProject(id, user.id);
    }

    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a project' })
  @ResponseMessage('Project updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.projectsService.update(id, dto, user.id);
  }

  @Patch(':id/archive')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Archive a project' })
  @ResponseMessage('Project archived successfully')
  archive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.projectsService.archive(id, user.id);
  }

  @Post(':id/members')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Add a project member' })
  @ResponseMessage('Project member assigned successfully')
  addMember(
    @Param('id', ParseUUIDPipe) projectId: string,
    @Body() dto: AddProjectMemberDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.projectsService.addMember(projectId, dto, user.id);
  }

  @Delete(':id/members/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remove a project member' })
  @ResponseMessage('Project member removed successfully')
  removeMember(
    @Param('id', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.projectsService.removeMember(projectId, userId, user.id);
  }
}
