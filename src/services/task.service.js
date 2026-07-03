import taskRepository from '../repositories/task.repository.js';
import cacheService from './cache.service.js';
import { TASK_PRIORITY, TASK_STATUS } from '../constants/task.constants.js';
import { parseTaskQueryParams } from '../utils/taskQuery.util.js';
import {
  parseTaskId,
  assertTaskOwnership,
  buildTaskUpdateFields,
} from '../utils/task.util.js';

const taskService = {
  async createTask(userId, { title, description, status, priority, dueDate }) {
    const task = taskRepository.create({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || TASK_STATUS.TODO,
      priority: priority || TASK_PRIORITY.MEDIUM,
      dueDate: dueDate || null,
      createdBy: userId,
      updatedBy: userId,
    });

    await cacheService.invalidateUserTasks(userId);
    return task;
  },

  async getTasks(userId, query = {}) {
    const filters = parseTaskQueryParams(query);
    const cacheKey = cacheService.buildTaskListCacheKey(userId, filters);

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = taskRepository.findByUserIdWithFilters(userId, filters);
    await cacheService.set(cacheKey, result);
    return result;
  },

  async getTaskById(userId, id) {
    const taskId = parseTaskId(id);
    const cacheKey = cacheService.buildTaskDetailCacheKey(userId, taskId);

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);

    await cacheService.set(cacheKey, task);
    return task;
  },

  async updateTask(userId, id, updates) {
    const taskId = parseTaskId(id);
    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);

    const updatedTask = taskRepository.update(
      taskId,
      buildTaskUpdateFields(userId, updates),
    );

    await cacheService.invalidateUserTasks(userId, taskId);
    return updatedTask;
  },

  async softDeleteTask(userId, id) {
    const taskId = parseTaskId(id);
    const task = taskRepository.findById(taskId);
    assertTaskOwnership(task, userId);

    const deletedTask = taskRepository.softDelete(taskId, {
      deletedBy: userId,
      updatedBy: userId,
    });

    await cacheService.invalidateUserTasks(userId, taskId);
    return deletedTask;
  },
};

export default taskService;
