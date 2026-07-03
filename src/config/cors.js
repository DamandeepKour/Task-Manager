import env from './env.js';

const parseOrigins = (origins) => {
  if (!origins || origins === '*') {
    return '*';
  }

  return origins.split(',').map((origin) => origin.trim()).filter(Boolean);
};

const corsConfig = {
  origin: parseOrigins(env.corsOrigin),
  credentials: env.corsCredentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsConfig;
