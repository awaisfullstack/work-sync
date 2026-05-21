import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [SequelizeModule.forFeature([ActivityLog, User, Project])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
