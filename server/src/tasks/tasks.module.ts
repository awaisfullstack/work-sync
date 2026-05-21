import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task-status.entity';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskComment } from './entities/task-comment';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectMember } from 'src/projects/entities/project-member.entity';
import { ActivityLogsModule } from 'src/activity-logs/activity-logs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Task,
      TaskStatus,
      TaskAssignment,
      TaskComment,
      User,
      Project,
      ProjectMember,
    ]),
    ActivityLogsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
