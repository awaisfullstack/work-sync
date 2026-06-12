import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
@Table({
  tableName: 'departments',
  timestamps: true,
  underscored: true,
})
export class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  // the foreign key in the target model
  @HasMany(() => User)
  declare users?: NonAttribute<User[]>;
}
