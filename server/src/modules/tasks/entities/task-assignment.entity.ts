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
  tableName: 'task_assignments',
  timestamps: true,
  underscored: true,
})
export class TaskAssignment extends Model<TaskAssignment> {
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

  @BelongsTo(() => User, 'userId')
  declare user?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare assignedBy: string;

  @BelongsTo(() => User, 'assignedBy')
  declare assigner?: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare assignedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare unassignedAt: Date | null;
}
