import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('daily_costs', {
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true, // Composite PK
        references: {
          model: 'projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true, // Composite PK
      },
      total_cost: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      total_requests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      currency_code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      warning_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      critical_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('daily_costs');
  },
};
