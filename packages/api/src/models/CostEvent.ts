import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../database';

export interface CostEventAttributes {
  id: string;
  projectId: string;
  featureId: string | null;
  endUserId: string | null;
  cost: bigint;
  currencyCode: string; // From gap analysis, keep standardized
  createdAt: Date; // Note: In gaps analysis there was a suggestion to add deleted_at for soft retention, but we stick to the PRD
}

export interface CostEventCreationAttributes extends Optional<
  CostEventAttributes,
  'id' | 'featureId' | 'endUserId' | 'createdAt'
> {}

export class CostEvent
  extends Model<CostEventAttributes, CostEventCreationAttributes>
  implements CostEventAttributes
{
  public id!: string;
  public projectId!: string;
  public featureId!: string | null;
  public endUserId!: string | null;
  public cost!: bigint;
  public currencyCode!: string;

  public readonly createdAt!: Date;
  // This table explicitly omits updatedAt as events are append-only time series data.
}

CostEvent.init(
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
    featureId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    endUserId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cost: {
      type: DataTypes.BIGINT,
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
  },
  {
    sequelize,
    tableName: 'cost_events',
    timestamps: true,
    updatedAt: false, // Append-only
    indexes: [
      {
        fields: ['projectId', 'createdAt'],
        name: 'idx_cost_events_project_date',
      },
    ],
  },
);
