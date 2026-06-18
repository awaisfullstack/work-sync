import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { Column, DataType, Model, Table } from 'sequelize-typescript';
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
}
