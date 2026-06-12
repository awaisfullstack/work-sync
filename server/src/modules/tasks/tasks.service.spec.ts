import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TasksService } from './tasks.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskComment } from './entities/task-comment';
import { TaskStatus } from './entities/task-status.entity';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task), useValue: {} },
        { provide: getModelToken(TaskStatus), useValue: {} },
        { provide: getModelToken(TaskAssignment), useValue: {} },
        { provide: getModelToken(TaskComment), useValue: {} },
        { provide: getModelToken(Project), useValue: {} },
        { provide: getModelToken(ProjectMember), useValue: {} },
        { provide: getModelToken(User), useValue: {} },
        { provide: ActivityLogsService, useValue: {} },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
