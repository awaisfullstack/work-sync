import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

export enum ShiftStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

@Table({
  tableName: 'shifts',
  timestamps: true,
  underscored: true,
})
export class Shift extends Model<Shift> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

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
  declare status: ShiftStatus;

  @BelongsTo(() => User)
  declare user: User;
}
