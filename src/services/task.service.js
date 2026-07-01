import taskRepository from '../repositories/task.repository.js';
import { TASK_PRIORITY, TASK_STATUS } from '../constants/task.constants.js';
import AppError from '../utils/AppError.js';

const parseTaskId = (id) => {
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new AppError('Invalid task id', 400);
  }

  return taskId;
};

const assertTaskOwnership = (task, userId) => {
  if (!task || task.createdBy !== userId) {
    throw new AppError('Task not found', 404);
  }
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
    });
  },

  getTasks(userId) {
    return taskRepository.findByUserId(userId);
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

    const updatedFields = {};

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

  deleteTask(userId, id) {
    const taskId = parseTaskId(id);
    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);

    taskRepository.delete(taskId);
  },
};

export default taskService;
