import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('subscriptions', {
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
      plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'plans',
          key: 'id',
        },
        onDelete: 'RESTRICT', // Can't delete a plan if someone is subscribed
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      current_period_start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      current_period_end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cancel_at_period_end: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gateway_subscription_id: {
        type: DataTypes.STRING(255),
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

    // Add partial unique index: Only 1 active subscription per user.
    await queryInterface.addIndex('subscriptions', ['user_id'], {
      name: 'idx_subscriptions_user_active_unique',
      unique: true,
      where: {
        status: 'active',
      },
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('subscriptions');
  },
};
