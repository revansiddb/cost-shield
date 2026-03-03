import { Model, DataTypes, Optional } from 'sequelize';
import { BillingInterval } from '@costshield/shared';

import { sequelize } from '../database';

export interface PlanAttributes {
  id: string;
  name: string;
  description: string | null;
  amount: bigint; // Standard requires BIGINT for currency values
  currencyCode: string;
  billingInterval: BillingInterval;
  requestLimit: number; // Max requests per month
  projectLimit: number; // Max projects allowed
  stripePriceId: string | null;
  razorpayPlanId: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlanCreationAttributes extends Optional<
  PlanAttributes,
  'id' | 'description' | 'stripePriceId' | 'razorpayPlanId' | 'isActive' | 'createdAt' | 'updatedAt'
> {}

export class Plan extends Model<PlanAttributes, PlanCreationAttributes> implements PlanAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public amount!: bigint;
  public currencyCode!: string;
  public billingInterval!: BillingInterval;
  public requestLimit!: number;
  public projectLimit!: number;
  public stripePriceId!: string | null;
  public razorpayPlanId!: string | null;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    billingInterval: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    requestLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    projectLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stripePriceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    razorpayPlanId: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'plans',
    timestamps: true,
  },
);
