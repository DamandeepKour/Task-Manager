import dotenv from 'dotenv';
import { validateEnv } from './env.validation.js';
import { CACHE_TTL } from '../constants/cache.constants.js';

dotenv.config();
validateEnv();

const nodeEnv = process.env.NODE_ENV || 'development';

const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return value === 'true';
};

const parsePositiveInt = (value, defaultValue) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : defaultValue;
};

const env = {
  nodeEnv,
  port: parsePositiveInt(process.env.PORT, 3000),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  corsCredentials: parseBoolean(process.env.CORS_CREDENTIALS, false),
  redis: {
    enabled: parseBoolean(process.env.REDIS_ENABLED, false) && nodeEnv !== 'test',
    url: process.env.REDIS_URL || 'redis://redis:6379',
    ttl: parsePositiveInt(process.env.REDIS_TTL, CACHE_TTL),
  },
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
};

export default env;
