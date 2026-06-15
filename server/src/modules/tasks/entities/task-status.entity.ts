import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Task } from './task.entity';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { TaskStatusName } from '../enums/task-status.enum';

@Table({
  tableName: 'task_statuses',
  timestamps: true,
  underscored: true,
})
export class TaskStatus extends Model<
  InferAttributes<TaskStatus>,
  InferCreationAttributes<TaskStatus>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatusName)),
    allowNull: false,
    unique: true,
  })
  declare name: TaskStatusName;

  @HasMany(() => Task)
  declare tasks?: NonAttribute<Task[]>;
}
