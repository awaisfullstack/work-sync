import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { TaskStatus } from '../tasks/entities/task-status.entity';
import { TaskAssignment } from '../tasks/entities/task-assignment.entity';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Project,
      ProjectMember,
      Task,
      TaskStatus,
      TaskAssignment,
      Shift,
    ]),
    ActivityLogsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
