import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Task } from '../tasks/entities/task.entity';
import { TaskAssignment } from '../tasks/entities/task-assignment.entity';
import { TaskStatus } from '../tasks/entities/task-status.entity';
import { User } from '../users/entities/user.entity';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getModelToken(User), useValue: {} },
        { provide: getModelToken(Task), useValue: {} },
        { provide: getModelToken(TaskStatus), useValue: {} },
        { provide: getModelToken(Project), useValue: {} },
        { provide: getModelToken(ProjectMember), useValue: {} },
        { provide: getModelToken(TaskAssignment), useValue: {} },
        { provide: getModelToken(Shift), useValue: {} },
        { provide: ActivityLogsService, useValue: {} },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
