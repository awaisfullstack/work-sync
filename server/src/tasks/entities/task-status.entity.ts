import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Task } from './task.entity';

export enum TaskStatusName {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Table({
  tableName: 'task_statuses',
  timestamps: true,
  underscored: true,
})
export class TaskStatus extends Model<TaskStatus> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare name: TaskStatusName;

  @HasMany(() => Task)
  declare tasks?: Task[];
}
