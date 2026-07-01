import taskService from '../services/task.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.util.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = taskService.createTask(req.userId, req.body);
  sendSuccess(res, 201, 'Task created successfully', task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = taskService.getTasks(req.userId);
  sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = taskService.getTaskById(req.userId, req.params.id);
  sendSuccess(res, 200, 'Task retrieved successfully', task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = taskService.updateTask(req.userId, req.params.id, req.body);
  sendSuccess(res, 200, 'Task updated successfully', task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  taskService.deleteTask(req.userId, req.params.id);
  sendSuccess(res, 200, 'Task deleted successfully');
});
