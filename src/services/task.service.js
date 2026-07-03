import taskRepository from '../repositories/task.repository.js';
import {
  TASK_PRIORITY,
  TASK_STATUS,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_SORT_FIELDS,
  TASK_QUERY_DEFAULTS,
} from '../constants/task.constants.js';
import ApiError from '../utils/ApiError.js';

const parseTaskId = (id) => {
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new ApiError('Invalid task id', 400);
  }

  return taskId;
};

const assertTaskOwnership = (task, userId) => {
  if (!task || task.createdBy !== userId) {
    throw new ApiError('Task not found', 404);
  }
};

const parsePositiveInt = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : defaultValue;
};

const parseTaskQueryParams = (query) => {
  const page = parsePositiveInt(query.page, TASK_QUERY_DEFAULTS.PAGE);
  const limit = parsePositiveInt(query.limit, TASK_QUERY_DEFAULTS.LIMIT);

  const status = TASK_STATUSES.includes(query.status) ? query.status : undefined;
  const priority = TASK_PRIORITIES.includes(query.priority) ? query.priority : undefined;
  const search = query.search?.trim() || undefined;

  const sortBy = TASK_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : TASK_QUERY_DEFAULTS.SORT_BY;

  const order = query.order?.toLowerCase() === 'asc' ? 'asc' : TASK_QUERY_DEFAULTS.ORDER;

  return { page, limit, status, priority, search, sortBy, order };
};

const taskService = {
  createTask(userId, { title, description, status, priority, dueDate }) {
    return taskRepository.create({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || TASK_STATUS.TODO,
      priority: priority || TASK_PRIORITY.MEDIUM,
      dueDate: dueDate || null,
      createdBy: userId,
      updatedBy: userId,
    });
  },

  getTasks(userId, query = {}) {
    const filters = parseTaskQueryParams(query);
    return taskRepository.findByUserIdWithFilters(userId, filters);
  },

  getTaskById(userId, id) {
    const taskId = parseTaskId(id);
    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);
    return task;
  },

  updateTask(userId, id, updates) {
    const taskId = parseTaskId(id);
    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);

    const updatedFields = { updatedBy: userId };

    if (updates.title !== undefined) {
      updatedFields.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      updatedFields.description = updates.description.trim();
    }

    if (updates.status !== undefined) {
      updatedFields.status = updates.status;
    }

    if (updates.priority !== undefined) {
      updatedFields.priority = updates.priority;
    }

    if (updates.dueDate !== undefined) {
      updatedFields.dueDate = updates.dueDate;
    }

    return taskRepository.update(taskId, updatedFields);
  },

  softDeleteTask(userId, id) {
    const taskId = parseTaskId(id);
    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);

    return taskRepository.softDelete(taskId, {
      deletedBy: userId,
      updatedBy: userId,
    });
  },
};

export default taskService;
