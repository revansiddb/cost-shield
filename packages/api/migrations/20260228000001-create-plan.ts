import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('plans', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
      currency_code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      billing_interval: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      request_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stripe_price_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      razorpay_plan_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('plans');
  },
};
