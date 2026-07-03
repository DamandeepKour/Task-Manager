import request from 'supertest';
import app from '../../src/app.js';
import { resetStores } from '../helpers/testHelpers.js';
import { TEST_PASSWORD } from '../helpers/constants.js';

describe('Auth API', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 400 for invalid registration data', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: '',
        email: 'invalid-email',
        password: 'short',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors.some((e) => e.field === 'password')).toBe(true);
    });

    it('should return 409 for duplicate email', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        password: TEST_PASSWORD,
      };

      await request(app).post('/api/auth/register').send(user);

      const response = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'Password2!',
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: TEST_PASSWORD,
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe('john@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
