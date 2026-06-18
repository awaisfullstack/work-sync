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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/auth.types';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../users/enums/users.enum';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { AddTaskCommentDto } from './dto/add-task-comment.dto';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
@ApiTags('Tasks')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a task' })
  @ResponseMessage('Task created successfully')
  create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks visible to current user' })
  findAll(
    @Query() query: GetTasksQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one task by id' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a task' })
  @ResponseMessage('Task updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.update(id, dto, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ResponseMessage('Task status updated successfully')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.updateStatus(id, dto.status, user);
  }

  @Post(':id/assign')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Assign a user to a task' })
  @ResponseMessage('Task member assigned successfully')
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.assign(id, dto, user);
  }

  @Patch(':id/unassign/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Unassign a user from a task' })
  @ResponseMessage('Task member removed successfully')
  unassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.unassign(id, userId, user);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a task comment' })
  @ResponseMessage('Comment added successfully')
  addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddTaskCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.addComment(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a task' })
  @ResponseMessage('Task deleted successfully')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.remove(id, user);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List task comments' })
  getTaskComments(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.getTaskComments(id, user);
  }

  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Delete a task comment' })
  @ResponseMessage('Comment deleted successfully')
  deleteTaskComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<null> {
    return this.tasksService.deleteTaskComment(id, commentId, user);
  }
}
