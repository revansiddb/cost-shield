import { Model, DataTypes, Optional } from 'sequelize';
import { SubscriptionStatus } from '@costshield/shared';

import { sequelize } from '../database';

export interface SubscriptionAttributes {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  gatewaySubscriptionId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionCreationAttributes extends Optional<
  SubscriptionAttributes,
  'id' | 'cancelAtPeriodEnd' | 'gatewaySubscriptionId' | 'createdAt' | 'updatedAt'
> {}

export class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: string;
  public userId!: string;
  public planId!: string;
  public status!: SubscriptionStatus;
  public currentPeriodStart!: Date;
  public currentPeriodEnd!: Date;
  public cancelAtPeriodEnd!: boolean;
  public gatewaySubscriptionId!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subscription.init(
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
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cancelAtPeriodEnd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gatewaySubscriptionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'subscriptions',
    timestamps: true,
  },
);
