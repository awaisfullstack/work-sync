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
import { User } from '../../users/entities/user.entity';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

@Table({
  tableName: 'project_members',
  timestamps: true,
  underscored: true,
})
export class ProjectMember extends Model<
  InferAttributes<ProjectMember>,
  InferCreationAttributes<ProjectMember>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectMemberRole)),
    allowNull: false,
    defaultValue: ProjectMemberRole.MEMBER,
  })
  declare roleInProject: ProjectMemberRole;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare joinedAt: Date;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project: NonAttribute<Project>;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'user',
  })
  declare user: NonAttribute<User>;
}
