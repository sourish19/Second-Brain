import 'dotenv/config';

import app from './app';
import dbConfig from './config/db.config';

import ENV from './config/env.config';

const PORT: number = +ENV.PORT || 5000;

dbConfig
  .connection()
  .then(() => {
    console.log('✅ Db connected successfully');

    app
      .listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      })
      .on('error', (err) => {
        console.error('Server failed to start', err);
      });
  })
  .catch((error) => {
    ENV.NODE_ENV === 'production' &&
      console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });
