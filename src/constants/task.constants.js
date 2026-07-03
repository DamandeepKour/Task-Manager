export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const TASK_STATUSES = Object.values(TASK_STATUS);
export const TASK_PRIORITIES = Object.values(TASK_PRIORITY);

export const TASK_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'status',
  'priority',
  'dueDate',
];

export const TASK_QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: 'createdAt',
  ORDER: 'desc',
};

export const TASK_DATE_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate'];

export const SORT_ORDERS = ['asc', 'desc'];
