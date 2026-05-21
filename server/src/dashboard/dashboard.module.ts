import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectMember } from 'src/projects/entities/project-member.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { TaskStatus } from 'src/tasks/entities/task-status.entity';
import { TaskComment } from 'src/tasks/entities/task-comment';
import { TaskAssignment } from 'src/tasks/entities/task-assignment.entity';
import { ActivityLogsModule } from 'src/activity-logs/activity-logs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Project,
      ProjectMember,
      Task,
      TaskStatus,
      TaskComment,
      TaskAssignment,
      Shift,
    ]),
    ActivityLogsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
