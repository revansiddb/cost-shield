import { Sequelize } from 'sequelize';

import { config } from '../config';
import { logger } from '../utils';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  logging: (msg) => logger.debug(msg),
  define: {
    underscored: true,
  },
});

export { sequelize };
