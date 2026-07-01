import taskService from '../services/task.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = taskService.createTask(req.userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = taskService.getTasks(req.userId);

  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: tasks,
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = taskService.getTaskById(req.userId, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task retrieved successfully',
    data: task,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = taskService.updateTask(req.userId, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  taskService.deleteTask(req.userId, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: null,
  });
});
