import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { GetActivityLogsQueryDto } from './dto/get-activity-logs-query.dto';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll(@Query() query: GetActivityLogsQueryDto) {
    return this.activityLogsService.findAll(query);
  }
}
