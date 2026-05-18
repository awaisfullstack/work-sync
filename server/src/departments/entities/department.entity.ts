import { Column, DataType, Model, Table } from 'sequelize-typescript';
@Table({
  tableName: 'departments',
  timestamps: true,
  underscored: true,
})
export class Department extends Model<Department> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;
}
