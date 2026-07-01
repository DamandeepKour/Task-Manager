import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (env.isDevelopment) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
