import { TASK_PRIORITY, TASK_STATUS, TASK_PRIORITIES, TASK_STATUSES } from '../../src/constants/task.constants.js';

describe('Task Constants', () => {
  it('should define valid task statuses', () => {
    expect(TASK_STATUS.TODO).toBe('Todo');
    expect(TASK_STATUS.IN_PROGRESS).toBe('In Progress');
    expect(TASK_STATUS.COMPLETED).toBe('Completed');
    expect(TASK_STATUSES).toEqual(['Todo', 'In Progress', 'Completed']);
  });

  it('should define valid task priorities', () => {
    expect(TASK_PRIORITY.LOW).toBe('Low');
    expect(TASK_PRIORITY.MEDIUM).toBe('Medium');
    expect(TASK_PRIORITY.HIGH).toBe('High');
    expect(TASK_PRIORITIES).toEqual(['Low', 'Medium', 'High']);
  });
});
