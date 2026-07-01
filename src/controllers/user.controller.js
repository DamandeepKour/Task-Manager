import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = authService.getProfile(req.userId);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
});
