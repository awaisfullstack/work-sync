import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

export enum ActivityAction {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_ARCHIVED = 'PROJECT_ARCHIVED',
  PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED',
  PROJECT_MEMBER_REMOVED = 'PROJECT_MEMBER_REMOVED',

  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_STATUS_UPDATED = 'TASK_STATUS_UPDATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UNASSIGNED = 'TASK_UNASSIGNED',
  TASK_COMMENT_ADDED = 'TASK_COMMENT_ADDED',
  TASK_COMMENT_DELETED = 'TASK_COMMENT_DELETED',

  SHIFT_CLOCKED_IN = 'SHIFT_CLOCKED_IN',
  SHIFT_CLOCKED_OUT = 'SHIFT_CLOCKED_OUT',
}

export enum ActivityEntityType {
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  TASK_COMMENT = 'TASK_COMMENT',
  TASK_ASSIGNMENT = 'TASK_ASSIGNMENT',
  SHIFT = 'SHIFT',
  USER = 'USER',
}

@Table({
  tableName: 'activity_logs',
  timestamps: true,
  underscored: true,
})
export class ActivityLog extends Model<ActivityLog> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare actorId: string | null;

  @BelongsTo(() => User, 'actorId')
  declare actor?: User;

  @Column({
    type: DataType.ENUM(...Object.values(ActivityAction)),
    allowNull: false,
  })
  declare action: ActivityAction;

  @Column({
    type: DataType.ENUM(...Object.values(ActivityEntityType)),
    allowNull: false,
  })
  declare entityType: ActivityEntityType;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare entityId: string | null;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare projectId: string | null;

  @BelongsTo(() => Project)
  declare project?: Project;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare metadata: Record<string, unknown> | null;
}
