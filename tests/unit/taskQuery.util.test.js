import { parseTaskQueryParams } from '../../src/utils/taskQuery.util.js';
import { TASK_QUERY_DEFAULTS } from '../../src/constants/task.constants.js';

describe('Task Query Parser', () => {
  it('should apply default query parameters', () => {
    const result = parseTaskQueryParams({});

    expect(result).toEqual({
      page: TASK_QUERY_DEFAULTS.PAGE,
      limit: TASK_QUERY_DEFAULTS.LIMIT,
      status: undefined,
      priority: undefined,
      search: undefined,
      sortBy: TASK_QUERY_DEFAULTS.SORT_BY,
      order: TASK_QUERY_DEFAULTS.ORDER,
    });
  });

  it('should parse valid filters', () => {
    const result = parseTaskQueryParams({
      page: '2',
      limit: '5',
      status: 'Todo',
      priority: 'High',
      search: 'project',
      sortBy: 'title',
      order: 'asc',
    });

    expect(result).toEqual({
      page: 2,
      limit: 5,
      status: 'Todo',
      priority: 'High',
      search: 'project',
      sortBy: 'title',
      order: 'asc',
    });
  });

  it('should ignore invalid filters safely', () => {
    const result = parseTaskQueryParams({
      page: '-1',
      limit: 'abc',
      status: 'Invalid',
      priority: 'Unknown',
      sortBy: 'invalidField',
      order: 'sideways',
    });

    expect(result.page).toBe(TASK_QUERY_DEFAULTS.PAGE);
    expect(result.limit).toBe(TASK_QUERY_DEFAULTS.LIMIT);
    expect(result.status).toBeUndefined();
    expect(result.priority).toBeUndefined();
    expect(result.sortBy).toBe(TASK_QUERY_DEFAULTS.SORT_BY);
    expect(result.order).toBe(TASK_QUERY_DEFAULTS.ORDER);
  });
});
