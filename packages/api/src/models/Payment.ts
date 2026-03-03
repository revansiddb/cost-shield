import { Model, DataTypes, Optional, Op } from 'sequelize';
import { PaymentStatus, Gateway } from '@costshield/shared';

import { sequelize } from '../database';

export interface PaymentAttributes {
  id: string;
  userId: string;
  subscriptionId: string | null;
  amount: bigint;
  currencyCode: string;
  status: PaymentStatus;
  gateway: Gateway;
  txnId: string | null;
  invoiceUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<
  PaymentAttributes,
  'id' | 'subscriptionId' | 'txnId' | 'invoiceUrl' | 'createdAt' | 'updatedAt'
> {}

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: string;
  public userId!: string;
  public subscriptionId!: string | null;
  public amount!: bigint;
  public currencyCode!: string;
  public status!: PaymentStatus;
  public gateway!: Gateway;
  public txnId!: string | null;
  public invoiceUrl!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
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
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'subscriptions',
        key: 'id',
      },
      onDelete: 'SET NULL',
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
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gateway: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    txnId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    invoiceUrl: {
      type: DataTypes.TEXT,
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
    tableName: 'payments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['gateway', 'txnId'],
        name: 'idx_payments_gateway_txn_unique',
        where: {
          txnId: {
            [Op.ne]: null,
          },
        },
      },
    ],
  },
);
