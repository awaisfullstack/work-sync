import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { User } from '../../users/entities/user.entity';
import { ShiftStatus } from '../enums/shift-status.enum';

@Table({
  tableName: 'shifts',
  timestamps: true,
  underscored: true,
})
export class Shift extends Model<
  InferAttributes<Shift>,
  InferCreationAttributes<Shift>
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
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare clockInAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare clockOutAt: Date | null;

  @Column({
    type: DataType.ENUM(...Object.values(ShiftStatus)),
    allowNull: false,
    defaultValue: ShiftStatus.ACTIVE,
  })
  declare status: CreationOptional<ShiftStatus>;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;
}
