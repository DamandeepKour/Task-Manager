import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(new ApiError('Validation failed', 400, errors));
  }

  next();
};
