import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_SORT_FIELDS,
  TASK_QUERY_DEFAULTS,
  SORT_ORDERS,
} from '../constants/task.constants.js';
import { parsePositiveInt } from './parse.util.js';

export const parseTaskQueryParams = (query) => {
  const page = parsePositiveInt(query.page, TASK_QUERY_DEFAULTS.PAGE);
  const limit = parsePositiveInt(query.limit, TASK_QUERY_DEFAULTS.LIMIT);

  const status = TASK_STATUSES.includes(query.status) ? query.status : undefined;
  const priority = TASK_PRIORITIES.includes(query.priority) ? query.priority : undefined;
  const search = query.search?.trim() || undefined;

  const sortBy = TASK_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : TASK_QUERY_DEFAULTS.SORT_BY;

  const normalizedOrder = query.order?.toLowerCase();
  const order = SORT_ORDERS.includes(normalizedOrder)
    ? normalizedOrder
    : TASK_QUERY_DEFAULTS.ORDER;

  return { page, limit, status, priority, search, sortBy, order };
};
