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
    beforeEach(async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Alpha Task', description: 'First task', status: 'Todo', priority: 'High' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Beta Task', description: 'Second task', status: 'Completed', priority: 'Low' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Gamma Report', description: 'Third task', status: 'In Progress', priority: 'Medium' });
    });

    it('should return paginated tasks with defaults', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tasks fetched successfully');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
      });
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
      });
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=Completed')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('Completed');
    });

    it('should filter by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=High')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe('High');
    });

    it('should search by title and description', async () => {
      const response = await request(app)
        .get('/api/tasks?search=report')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Gamma Report');
    });

    it('should sort by title ascending', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=title&order=asc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data[0].title).toBe('Alpha Task');
      expect(response.body.data[2].title).toBe('Gamma Report');
    });

    it('should ignore invalid filters safely', async () => {
      const response = await request(app)
        .get('/api/tasks?status=Invalid&priority=Unknown&sortBy=invalidField')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id/delete', () => {
    let taskId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to delete' });

      taskId = createRes.body.data.id;
    });

    it('should soft delete a task successfully', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/delete`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('should exclude soft deleted tasks from GET /api/tasks', async () => {
      await request(app)
        .patch(`/api/tasks/${taskId}/delete`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return 404 for soft deleted task by ID', async () => {
      await request(app)
        .patch(`/api/tasks/${taskId}/delete`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).patch(`/api/tasks/${taskId}/delete`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
