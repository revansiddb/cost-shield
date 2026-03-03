import { app } from './app';
import { config } from './config';
import { logger } from './utils';

const start = async (): Promise<void> => {
  try {
    // DB sync will go here once models are defined
    // await sequelize.authenticate();
    // logger.info('Database connected.');

    app.listen(config.port, () => {
      logger.info(`[CostShield API] Running on port ${config.port} (${config.nodeEnv})`);
    });
  } catch (error) {
    logger.error('Failed to start server:', { error });
    process.exit(1);
  }
};

start();
