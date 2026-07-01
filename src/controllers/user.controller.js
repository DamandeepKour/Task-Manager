import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.util.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = authService.getProfile(req.userId);
  sendSuccess(res, 200, 'Profile retrieved successfully', user);
});
