import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../database';

export interface CountryAttributes {
  id: number;
  isoCode: string;
  name: string;
  currencyCode: string;
  taxRate: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CountryCreationAttributes extends Optional<
  CountryAttributes,
  'id' | 'taxRate' | 'isActive' | 'createdAt' | 'updatedAt'
> {}

export class Country
  extends Model<CountryAttributes, CountryCreationAttributes>
  implements CountryAttributes
{
  public id!: number;
  public isoCode!: string;
  public name!: string;
  public currencyCode!: string;
  public taxRate!: number;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isoCode: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 4), // Kept decimal here as it's a rate, not an absolute currency amount
      allowNull: false,
      defaultValue: 0.0,
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
    tableName: 'countries',
    timestamps: true,
  },
);
