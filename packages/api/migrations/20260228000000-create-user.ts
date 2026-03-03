import { QueryInterface, DataTypes } from 'sequelize';
import { UserRole } from '@costshield/shared'; // Note: Cannot easily import this into a pure migration if not compiled. Assuming migration runs via ts-node. Mapped to strings here to be safe.

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // foreign key relationship established once countries table is created
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'user', // UserRole.USER
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Usually mapped to timestamptz in pg
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Indexes
    await queryInterface.addIndex('users', ['email'], {
      name: 'idx_users_email_unique',
      unique: true,
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('users');
  },
};
