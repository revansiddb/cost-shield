import { Model, DataTypes, Optional } from 'sequelize';
import { ProjectStatus } from '@costshield/shared';

import { sequelize } from '../database';

export interface ProjectAttributes {
  id: string;
  userId: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  keyPrefix: string;
  apiKeyHash: string;
  currencyCode: string; // Standardize column
  dailyBudget: bigint;
  monthlyBudget: bigint | null;
  alertThreshold: number; // Percentage
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectCreationAttributes extends Optional<
  ProjectAttributes,
  'id' | 'slug' | 'status' | 'monthlyBudget' | 'createdAt' | 'updatedAt'
> {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: string;
  public userId!: string;
  public name!: string;
  public slug!: string;
  public status!: ProjectStatus;
  public keyPrefix!: string;
  public apiKeyHash!: string;
  public currencyCode!: string;
  public dailyBudget!: bigint;
  public monthlyBudget!: bigint | null;
  public alertThreshold!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ProjectStatus.ACTIVE,
    },
    keyPrefix: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // As per standard, prefix itself should be unique globally for instant index routing
    },
    apiKeyHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    dailyBudget: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    monthlyBudget: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    alertThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 80, // Default to 80% as per requirements
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
    tableName: 'projects',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'slug'],
        name: 'idx_projects_user_slug_unique',
      },
      {
        fields: ['keyPrefix'], // Fast lookup cache for tracking API
        name: 'idx_projects_key_prefix',
      },
    ],
  },
);
