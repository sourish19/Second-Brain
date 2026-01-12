import 'dotenv/config';

import app from './app';
import dbConfig from './config/db.config';
import logger from './config/logger.config';
import "./config/passport"

import ENV from './config/env.config';

const PORT: number = +ENV.PORT || 5000;

dbConfig
  .connection()
  .then(() => {
    logger.info('Db connected successfully');

    app
      .listen(PORT, () => {
        logger.info({ port: PORT }, 'Server started');
      })
      .on('error', (err) => {
        logger.fatal({ err }, 'Server failed to start');
      });
  })
  .catch((error) => {
    if (ENV.NODE_ENV === 'production')
      logger.fatal({ err: error }, 'Failed to connect to database');
    process.exit(1);
  });
