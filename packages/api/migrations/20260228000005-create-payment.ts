import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('payments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      subscription_id: {
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
      currency_code: {
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
      txn_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      invoice_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Unique index for (gateway, txn_id) where txn_id IS NOT NULL
    // This requires a raw query or sequelize options for passing PG specific syntax
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX "idx_payments_gateway_txn_unique" 
      ON "payments" ("gateway", "txn_id") 
      WHERE "txn_id" IS NOT NULL;
    `);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('payments');
  },
};
