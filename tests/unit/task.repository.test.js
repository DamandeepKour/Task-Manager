import taskRepository from '../../src/repositories/task.repository.js';
import { TASK_QUERY_DEFAULTS } from '../../src/constants/task.constants.js';

describe('Task Repository - findByUserIdWithFilters', () => {
  beforeEach(() => {
    taskRepository.reset();
  });

  const seedTasks = () => {
    taskRepository.create({
      title: 'Alpha Task',
      description: 'First description',
      status: 'Todo',
      priority: 'High',
      dueDate: '2026-01-01',
      createdBy: 1,
    });
    taskRepository.create({
      title: 'Beta Task',
      description: 'Second description',
      status: 'Completed',
      priority: 'Low',
      dueDate: '2026-06-01',
      createdBy: 1,
    });
    taskRepository.create({
      title: 'Gamma Report',
      description: 'Report details',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '2026-12-01',
      createdBy: 2,
    });
  };

  it('should return only tasks for the given user', () => {
    seedTasks();

    const result = taskRepository.findByUserIdWithFilters(1, {
      page: 1,
      limit: 10,
      sortBy: TASK_QUERY_DEFAULTS.SORT_BY,
      order: TASK_QUERY_DEFAULTS.ORDER,
    });

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
  });

  it('should filter by status and priority', () => {
    seedTasks();

    const result = taskRepository.findByUserIdWithFilters(1, {
      status: 'Todo',
      priority: 'High',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      order: 'desc',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Alpha Task');
  });

  it('should search in title and description', () => {
    seedTasks();

    const result = taskRepository.findByUserIdWithFilters(1, {
      search: 'second',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      order: 'desc',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Beta Task');
  });

  it('should paginate results', () => {
    seedTasks();

    const result = taskRepository.findByUserIdWithFilters(1, {
      page: 1,
      limit: 1,
      sortBy: 'title',
      order: 'asc',
    });

    expect(result.data).toHaveLength(1);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    });
  });
});
