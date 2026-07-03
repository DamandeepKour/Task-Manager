import { getRedisClient } from '../config/redis.js';
import env from '../config/env.js';
import { CACHE_KEY_PREFIX } from '../constants/cache.constants.js';
import logger from '../config/logger.js';

const buildTaskListCacheKey = (userId, filters) =>
  `${CACHE_KEY_PREFIX.TASK_LIST}${userId}:${Buffer.from(JSON.stringify(filters)).toString('base64')}`;

const buildTaskDetailCacheKey = (userId, taskId) =>
  `${CACHE_KEY_PREFIX.TASK_DETAIL}${userId}:${taskId}`;

const cacheService = {
  buildTaskListCacheKey,
  buildTaskDetailCacheKey,

  async get(key) {
    const client = getRedisClient();
    if (!client) {
      return null;
    }

    try {
      const cached = await client.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Cache read failed', { key, message: error.message });
      return null;
    }
  },

  async set(key, value) {
    const client = getRedisClient();
    if (!client) {
      return;
    }

    try {
      await client.set(key, JSON.stringify(value), { EX: env.redis.ttl });
    } catch (error) {
      logger.warn('Cache write failed', { key, message: error.message });
    }
  },

  async invalidateUserTasks(userId, taskId = null) {
    const client = getRedisClient();
    if (!client) {
      return;
    }

    try {
      const listKeys = await client.keys(`${CACHE_KEY_PREFIX.TASK_LIST}${userId}:*`);

      if (listKeys.length > 0) {
        await client.del(listKeys);
      }

      if (taskId) {
        await client.del(buildTaskDetailCacheKey(userId, taskId));
      }
    } catch (error) {
      logger.warn('Cache invalidation failed', { userId, taskId, message: error.message });
    }
  },
};

export default cacheService;
