import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.util.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  sendSuccess(res, 201, 'User registered successfully', user);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, 200, 'Login successful', result);
});
