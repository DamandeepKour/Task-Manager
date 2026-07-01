import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/task.constants.js';

const sendValidationError = (res, message) => {
  res.status(400).json({
    success: false,
    message,
    data: null,
  });
};

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const validateStatus = (status) => TASK_STATUSES.includes(status);
const validatePriority = (priority) => TASK_PRIORITIES.includes(priority);

export const validateCreateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;

  if (!title || !String(title).trim()) {
    return sendValidationError(res, 'Title is required');
  }

  if (status !== undefined && !validateStatus(status)) {
    return sendValidationError(res, 'Invalid status value');
  }

  if (priority !== undefined && !validatePriority(priority)) {
    return sendValidationError(res, 'Invalid priority value');
  }

  if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
    return sendValidationError(res, 'Invalid due date');
  }

  next();
};

export const validateUpdateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;

  if (title !== undefined && !String(title).trim()) {
    return sendValidationError(res, 'Title cannot be empty');
  }

  if (status !== undefined && !validateStatus(status)) {
    return sendValidationError(res, 'Invalid status value');
  }

  if (priority !== undefined && !validatePriority(priority)) {
    return sendValidationError(res, 'Invalid priority value');
  }

  if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
    return sendValidationError(res, 'Invalid due date');
  }

  next();
};
