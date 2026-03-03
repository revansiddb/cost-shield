import { Model, DataTypes, Optional } from 'sequelize';
import { AlertType } from '@costshield/shared';

import { sequelize } from '../database';

export interface BudgetAlertAttributes {
  id: string;
  projectId: string;
  type: AlertType;
  cost: bigint;
  budget: bigint;
  date: string; // YYYY-MM-DD
  currencyCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetAlertCreationAttributes extends Optional<
  BudgetAlertAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {}

export class BudgetAlert
  extends Model<BudgetAlertAttributes, BudgetAlertCreationAttributes>
  implements BudgetAlertAttributes
{
  public id!: string;
  public projectId!: string;
  public type!: AlertType;
  public cost!: bigint;
  public budget!: bigint;
  public date!: string;
  public currencyCode!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BudgetAlert.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cost: {
      type: DataTypes.BIGINT, // Standardized explicit money scale
      allowNull: false,
    },
    budget: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
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
    tableName: 'budget_alerts',
    timestamps: true,
    indexes: [
      {
        fields: ['projectId', 'date'],
        name: 'idx_budget_alerts_project_date',
      },
    ],
  },
);
