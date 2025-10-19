import redis from '../config/redis.config';
import ENV from '../config/env.config';

export const setValueToCache = async (key: string, value: unknown) => {
  try {
    if (typeof value === 'string')
      await redis.set(`cached:${key}`, `_str_${value}`, 'EX', 3600); // 1hr
    else
      await redis.set(
        `cached:${key}`,
        `_json_${JSON.stringify(value)}`,
        'EX',
        3600 // 1hr
      );
  } catch (error) {
    // Fail silently
    ENV.NODE_ENV !== 'production' &&
      console.error(`Redis cache set failed for key: ${key} --> `, error);
  }
};

export const getValueFromCache = async (
  key: string
): Promise<unknown | null> => {
  try {
    const value = await redis.get(`cached:${key}`);

    if (!value) return null;

    if (value.startsWith('_str_')) return value.slice(5);
    if (value.startsWith('_json_')) return JSON.parse(value.slice(6));

    return value;
  } catch (error) {
    // Fail silently
    ENV.NODE_ENV !== 'production' &&
      console.error(`Redis cache get failed for key: ${key} --> `, error);
  }
  return null;
};

export const deleteValueFromCache = async (key: string) => {
  try {
    await redis.del(`cached:${key}`);
  } catch (error) {
    // Fail silently
    ENV.NODE_ENV !== 'production' &&
      console.error(`Redis cache delete failed for key: ${key} --> `, error);
  }
};
