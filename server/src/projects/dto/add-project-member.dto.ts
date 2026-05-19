import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ProjectMemberRole } from '../enums/project-member-role.enum';

export class AddProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(ProjectMemberRole)
  roleInProject: ProjectMemberRole = ProjectMemberRole.MEMBER;
}
