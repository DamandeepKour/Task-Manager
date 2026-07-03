import cacheService from '../../src/services/cache.service.js';

describe('Cache Service', () => {
  it('should return null when Redis is unavailable', async () => {
    const result = await cacheService.get('tasks:list:1:test');
    expect(result).toBeNull();
  });

  it('should not throw when setting cache without Redis', async () => {
    await expect(
      cacheService.set('tasks:list:1:test', { data: [], pagination: {} }),
    ).resolves.toBeUndefined();
  });

  it('should not throw when invalidating cache without Redis', async () => {
    await expect(cacheService.invalidateUserTasks(1, 1)).resolves.toBeUndefined();
  });

  it('should build consistent cache keys', () => {
    const filters = { page: 1, limit: 10, sortBy: 'createdAt', order: 'desc' };
    const key = cacheService.buildTaskListCacheKey(1, filters);

    expect(key).toMatch(/^tasks:list:1:/);
    expect(cacheService.buildTaskDetailCacheKey(1, 5)).toBe('tasks:detail:1:5');
  });
});
