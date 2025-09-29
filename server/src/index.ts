import 'dotenv/config';
import app from './app';

const PORT: number = Number(process.env.PORT) || 5000;

app
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })
  .on('error', (err) => {
    console.error('Server failed to start', err);
  });
