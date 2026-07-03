import { accessLogger } from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    accessLogger.info('Incoming request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: req.ip,
    });
  });

  next();
};
