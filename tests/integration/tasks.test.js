import request from 'supertest';
import app from '../../src/app.js';
import { registerAndLogin, resetStores } from '../helpers/testHelpers.js';

describe('Tasks API', () => {
  let token;

  beforeEach(async () => {
    resetStores();
    const auth = await registerAndLogin(request, app);
    token = auth.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Complete project',
          description: 'Finish API tests',
          status: 'Todo',
          priority: 'High',
          dueDate: '2026-12-31',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toMatchObject({
        title: 'Complete project',
        description: 'Finish API tests',
        status: 'Todo',
        priority: 'High',
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Unauthorized task',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid task data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks for the authenticated user', async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task One' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task Two' });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tasks retrieved successfully');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
