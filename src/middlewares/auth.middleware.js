import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';

export const authenticate = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401));
    }

    next(error);
  }
};
