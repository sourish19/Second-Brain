import 'dotenv/config';
import app from './app';
import dbConfig from './config/db.config';

const PORT: number = Number(process.env.PORT) || 5000;

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
  .catch(() => process.exit(1));
