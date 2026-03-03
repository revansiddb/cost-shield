import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../database';

export interface DailyCostAttributes {
  projectId: string;
  date: string; // YYYY-MM-DD format
  totalCost: bigint;
  totalRequests: number;
  currencyCode: string;
  warningSent: boolean;
  criticalSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DailyCostCreationAttributes extends Optional<
  DailyCostAttributes,
  'warningSent' | 'criticalSent' | 'createdAt' | 'updatedAt'
> {}

export class DailyCost
  extends Model<DailyCostAttributes, DailyCostCreationAttributes>
  implements DailyCostAttributes
{
  public projectId!: string;
  public date!: string;
  public totalCost!: bigint;
  public totalRequests!: number;
  public currencyCode!: string;
  public warningSent!: boolean;
  public criticalSent!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DailyCost.init(
  {
    projectId: {
      type: DataTypes.UUID,
      primaryKey: true, // Composite PK part 1
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true, // Composite PK part 2
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0n,
    },
    totalRequests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    warningSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    criticalSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'daily_costs',
    timestamps: true,
  },
);
