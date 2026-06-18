import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { ActivityAction } from '../enums/activity-action.enum';
import { ActivityEntityType } from '../enums/activity-entity-type.enum';

export { ActivityAction } from '../enums/activity-action.enum';
export { ActivityEntityType } from '../enums/activity-entity-type.enum';

@Table({
  tableName: 'activity_logs',
  timestamps: true,
  updatedAt: false,
  underscored: true,
})
export class ActivityLog extends Model<
  InferAttributes<ActivityLog>,
  InferCreationAttributes<ActivityLog>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare actorId: string | null;

  @BelongsTo(() => User, 'actorId')
  declare actor?: NonAttribute<User>;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
  })
  declare action: ActivityAction;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare entityType: ActivityEntityType;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare entityId: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;
}
