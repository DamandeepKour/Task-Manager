import env from '../config/env.js';

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (env.isDevelopment) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
