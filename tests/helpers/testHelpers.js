import userRepository from '../../src/repositories/user.repository.js';
import taskRepository from '../../src/repositories/task.repository.js';
import { TEST_PASSWORD } from './constants.js';

export const resetStores = () => {
  userRepository.reset();
  taskRepository.reset();
};

export const registerAndLogin = async (request, app, user = {}) => {
  const payload = {
    name: user.name || 'Test User',
    email: user.email || `user-${Date.now()}@example.com`,
    password: user.password || TEST_PASSWORD,
  };

  await request(app).post('/api/auth/register').send(payload);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: payload.email, password: payload.password });

  return {
    token: loginRes.body.data.token,
    user: loginRes.body.data.user,
    credentials: payload,
  };
};
