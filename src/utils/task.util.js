import ApiError from './ApiError.js';
import { TASK_MESSAGES } from '../constants/messages.constants.js';

export const parseTaskId = (id) => {
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new ApiError(TASK_MESSAGES.INVALID_ID, 400);
  }

  return taskId;
};

export const assertTaskOwnership = (task, userId) => {
  if (!task || task.createdBy !== userId) {
    throw new ApiError(TASK_MESSAGES.NOT_FOUND, 404);
  }
};

export const buildTaskUpdateFields = (userId, updates) => {
  const fields = { updatedBy: userId };

  if (updates.title !== undefined) {
    fields.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    fields.description = updates.description.trim();
  }

  if (updates.status !== undefined) {
    fields.status = updates.status;
  }

  if (updates.priority !== undefined) {
    fields.priority = updates.priority;
  }

  if (updates.dueDate !== undefined) {
    fields.dueDate = updates.dueDate;
  }

  return fields;
};
