import { Model, DataTypes, Optional } from 'sequelize';
import { UserRole } from '@costshield/shared';

import { sequelize } from '../database';

export interface UserAttributes {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  countryId: number | null;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes extends Optional<
  UserAttributes,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'countryId'
  | 'role'
  | 'isEmailVerified'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public firstName!: string | null;
  public lastName!: string | null;
  public phone!: string | null;
  public countryId!: number | null;
  public role!: UserRole;
  public isEmailVerified!: boolean;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  },
);
