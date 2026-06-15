import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Task } from './task.entity';
import { User } from '../../users/entities/user.entity';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

@Table({
  tableName: 'task_comments',
  timestamps: true,
  underscored: true,
})
export class TaskComment extends Model<
  InferAttributes<TaskComment>,
  InferCreationAttributes<TaskComment>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare taskId: string;

  @BelongsTo(() => Task)
  declare task?: NonAttribute<Task>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare comment: string;
}
