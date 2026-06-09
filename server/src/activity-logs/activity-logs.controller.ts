import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { GetActivityLogsQueryDto } from './dto/get-activity-logs-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/types';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activity-logs')
@ApiTags('Activity Logs')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'List activity logs visible to current user' })
  findAll(
    @Query() query: GetActivityLogsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.activityLogsService.findAll(query, user);
  }
}
