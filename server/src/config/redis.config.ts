import Redis from 'ioredis';

import ENV from './env.config';

const redis = new Redis({
  host: ENV.REDIS_HOST,
  port: Number(ENV.REDIS_PORT)
});

export default redis;
