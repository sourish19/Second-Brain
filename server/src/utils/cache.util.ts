import redis from '../config/redis.config';
import ENV from '../config/env.config';
import logger from '../config/logger.config';
// TODO: REMOVE let val
export const setValueToCache = async (
  type: string,
  key: string,
  value: unknown
) => {
  try {
    let val;
    if (typeof value === 'string')
      val = await redis.set(
        `${type}:cached:${key}`,
        `_str_${value}`,
        'EX',
        3600
      );
    // 1hr
    else
      val = await redis.set(
        `${type}:cached:${key}`,
        `_json_${JSON.stringify(value)}`,
        'EX',
        3600 // 1hr
      );
    ENV.NODE_ENV !== 'production' && logger.debug({ result: val }, 'Redis set');
  } catch (error) {
    // Fail silently
    ENV.NODE_ENV !== 'production' &&
      logger.error({ err: error, key }, 'Redis cache set failed');
  }
};

export const getValueFromCache = async (
  type: string,
  key: string
): Promise<unknown | null> => {
  try {
    const value = await redis.get(`${type}:cached:${key}`);

    if (!value) return null;

    if (value.startsWith('_str_')) return value.slice(5);
    if (value.startsWith('_json_')) return JSON.parse(value.slice(6));
    ENV.NODE_ENV !== 'production' && logger.debug({ value }, 'Redis get');

    return value;
  } catch (error) {
    // Fail silently
    ENV.NODE_ENV !== 'production' &&
      logger.error({ err: error, key }, 'Redis cache get failed');
  }
  return null;
};

export const deleteValueFromCache = async (type: string, key: string) => {
  try {
    const val = await redis.del(`${type}:cached:${key}`);
    ENV.NODE_ENV !== 'production' && logger.debug({ result: val }, 'Redis del');
  } catch (error) {
    // Fail silently
    ENV.NODE_ENV !== 'production' &&
      logger.error({ err: error, key }, 'Redis cache delete failed');
  }
};
