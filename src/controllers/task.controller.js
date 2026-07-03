import taskService from '../services/task.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginatedSuccess } from '../utils/response.util.js';
import { TASK_MESSAGES } from '../constants/messages.constants.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.userId, req.body);
  sendSuccess(res, 201, TASK_MESSAGES.CREATED, task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const { data, pagination } = await taskService.getTasks(req.userId, req.query);
  sendPaginatedSuccess(res, 200, TASK_MESSAGES.FETCHED, data, pagination);
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.userId, req.params.id);
  sendSuccess(res, 200, TASK_MESSAGES.RETRIEVED, task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.userId, req.params.id, req.body);
  sendSuccess(res, 200, TASK_MESSAGES.UPDATED, task);
});

export const softDeleteTask = asyncHandler(async (req, res) => {
  await taskService.softDeleteTask(req.userId, req.params.id);
  sendSuccess(res, 200, TASK_MESSAGES.DELETED);
});
