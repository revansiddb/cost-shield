import { config } from './index';

// Used by Sequelize CLI
module.exports = {
  development: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
  },
  test: {
    username: config.db.user,
    password: config.db.password,
    database: `${config.db.name}_test`,
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
  },
  production: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
