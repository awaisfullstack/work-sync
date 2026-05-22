import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ProjectStatus } from '../enums/project-status.enum';
import { User } from 'src/users/entities/user.entity';
import { ProjectMember } from './project-member.entity';

@Table({
  tableName: 'projects',
  timestamps: true,
  underscored: true,
})
export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
    defaultValue: ProjectStatus.ACTIVE,
  })
  declare status: CreationOptional<ProjectStatus>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare deadline: Date | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare createdById: string;

  @BelongsTo(() => User, {
    foreignKey: 'createdById',
    as: 'createdBy',
  })
  declare createdBy: NonAttribute<User>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare archivedAt: Date | null;

  @HasMany(() => ProjectMember, {
    foreignKey: 'projectId',
    as: 'members',
  })
  declare members: NonAttribute<ProjectMember[]>;
}
