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
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Department } from '../../departments/entities/department.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';
import { Role } from '../enums/users.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
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
  })
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.EMPLOYEE,
  })
  declare role: CreationOptional<Role>;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare departmentId: string | null;

  // belongsTo puts it in the source model
  // This model has the foreign key.
  @BelongsTo(() => Department)
  declare department?: NonAttribute<Department>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: CreationOptional<boolean>;

  @HasMany(() => ProjectMember)
  declare projectMemberships: NonAttribute<ProjectMember[]>;
}
