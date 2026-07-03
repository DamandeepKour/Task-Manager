import { createClient } from 'redis';
import env from './env.js';
import logger from './logger.js';

let client = null;

export const initRedis = async () => {
  if (!env.redis.enabled) {
    logger.info('Redis caching is disabled');
    return;
  }

  try {
    client = createClient({ url: env.redis.url });

    client.on('error', (error) => {
      logger.warn('Redis client error', { message: error.message });
    });

    await client.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.warn('Redis unavailable — application will continue without cache', {
      message: error.message,
    });
    client = null;
  }
};

export const getRedisClient = () => {
  if (!client?.isOpen) {
    return null;
  }

  return client;
};

export const disconnectRedis = async () => {
  if (client?.isOpen) {
    await client.quit();
    client = null;
  }
};
