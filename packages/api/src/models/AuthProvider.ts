import { Model, DataTypes, Optional } from 'sequelize';
import { AuthProvider as AuthProviderEnum } from '@costshield/shared';

import { sequelize } from '../database';

export interface AuthProviderAttributes {
  id: string;
  userId: string;
  provider: AuthProviderEnum;
  providerUid: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthProviderCreationAttributes extends Optional<
  AuthProviderAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {}

export class AuthProvider
  extends Model<AuthProviderAttributes, AuthProviderCreationAttributes>
  implements AuthProviderAttributes
{
  public id!: string;
  public userId!: string;
  public provider!: AuthProviderEnum;
  public providerUid!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuthProvider.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    providerUid: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    tableName: 'auth_providers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['provider', 'providerUid'],
        name: 'idx_auth_providers_provider_uid_unique',
      },
    ],
  },
);
