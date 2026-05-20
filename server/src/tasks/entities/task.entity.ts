import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { TaskStatus } from './task-status.entity';
import { TaskAssignment } from './task-assignment.entity';
import { TaskComment } from './task-comment';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

@Table({
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
})
export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
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
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare dueDate: string;

  @ForeignKey(() => TaskStatus)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare statusId: string;

  @BelongsTo(() => TaskStatus)
  declare status?: NonAttribute<TaskStatus>;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project)
  declare project?: NonAttribute<Project>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare createdBy: string;

  @BelongsTo(() => User, 'createdBy')
  declare creator?: NonAttribute<User>;

  @HasMany(() => TaskAssignment)
  declare assignments?: NonAttribute<TaskAssignment[]>;

  @HasMany(() => TaskComment)
  declare comments?: NonAttribute<TaskComment[]>;
}
