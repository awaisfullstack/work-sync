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

@Table({
  tableName: 'task_comments',
  timestamps: true,
  underscored: true,
})
export class TaskComment extends Model<TaskComment> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare taskId: string;

  @BelongsTo(() => Task)
  declare task?: Task;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare comment: string;
}
