import env from '../config/env.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;

    if (statusCode >= 500) {
      logger.error(message, {
        statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
      });
    } else {
      logger.warn(message, {
        statusCode,
        method: req.method,
        url: req.originalUrl,
      });
    }
  } else {
    logger.error('Unhandled error', {
      message: err.message,
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
    });

    if (env.isDevelopment) {
      console.error(err);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
