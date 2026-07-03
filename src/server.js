import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { initRedis, disconnectRedis } from './config/redis.js';

const { port, nodeEnv } = env;

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack = reason instanceof Error ? reason.stack : undefined;

  logger.error('Unhandled Promise Rejection', { message, stack });
});

const startServer = async () => {
  await initRedis();

  const server = app.listen(port, () => {
    logger.info('Application started', { port, environment: nodeEnv });
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectRedis();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
