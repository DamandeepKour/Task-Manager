import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const authService = {
  async register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ApiError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  },

  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  },

  getProfile(userId) {
    const user = userRepository.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return sanitizeUser(user);
  },
};

export default authService;
