import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;
