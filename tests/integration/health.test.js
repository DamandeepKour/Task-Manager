import request from 'supertest';
import app from '../../src/app.js';

describe('Health API', () => {
  it('should return 200 with success message', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Server is running',
    });
  });
});
