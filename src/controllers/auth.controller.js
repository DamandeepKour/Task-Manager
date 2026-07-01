import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});
