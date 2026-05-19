import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProjectMemberRole } from '../enums/project-member-role.enum';
import { Project } from './project.entity';
import { User } from 'src/users/entities/user.entity';

@Table({
  tableName: 'project_members',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'user_id'],
    },
  ],
})
export class ProjectMember extends Model<ProjectMember> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'project_id',
  })
  declare projectId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectMemberRole)),
    allowNull: false,
    defaultValue: ProjectMemberRole.MEMBER,
    field: 'role_in_project',
  })
  declare roleInProject: ProjectMemberRole;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'joined_at',
  })
  declare joinedAt: Date;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project: Project;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'user',
  })
  declare user: User;
}
