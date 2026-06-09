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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from 'src/types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { ProjectQueryDto } from './dto/project-query.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('projects')
@ApiTags('Projects')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
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
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === UserRole.EMPLOYEE) {
      await this.projectsService.ensureEmployeeCanAccessProject(id, user.id);
    }

    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Patch(':id/archive')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Archive a project' })
  archive(@Param('id') id: string) {
    return this.projectsService.archive(id);
  }

  @Post(':id/members')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Add a project member' })
  addMember(@Param('id') projectId: string, @Body() dto: AddProjectMemberDto) {
    return this.projectsService.addMember(projectId, dto);
  }

  @Get(':id/members')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List project members' })
  getMembers(@Param('id') projectId: string) {
    return this.projectsService.getProjectMembers(projectId);
  }

  @Delete(':id/members/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove a project member' })
  removeMember(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectsService.removeMember(projectId, userId);
  }
}
