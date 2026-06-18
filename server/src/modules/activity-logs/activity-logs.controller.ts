import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { GetActivityLogsQueryDto } from './dto/get-activity-logs-query.dto';
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activity-logs')
@ApiTags('Activity Logs')
@ApiCookieAuth('access_token')
@ApiBearerAuth('access-token')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List activity logs for admins' })
  findAll(@Query() query: GetActivityLogsQueryDto) {
    return this.activityLogsService.findAll(query);
  }
}
