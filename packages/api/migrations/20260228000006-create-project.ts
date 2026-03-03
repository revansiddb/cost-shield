import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('projects', {
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
        defaultValue: 'active',
      },
      key_prefix: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      api_key_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      currency_code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      daily_budget: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      monthly_budget: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      alert_threshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 80,
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

    // Indexes
    await queryInterface.addIndex('projects', ['user_id', 'slug'], {
      name: 'idx_projects_user_slug_unique',
      unique: true,
    });

    await queryInterface.addIndex('projects', ['key_prefix'], {
      name: 'idx_projects_key_prefix',
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('projects');
  },
};
