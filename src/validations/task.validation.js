import { body } from 'express-validator';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/task.constants.js';

const isValidDate = (value) => {
  if (value === null) {
    return true;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage('Invalid priority value'),
  body('dueDate')
    .optional({ nullable: true })
    .custom((value) => {
      if (!isValidDate(value)) {
        throw new Error('Invalid due date');
      }
      return true;
    }),
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage('Invalid priority value'),
  body('dueDate')
    .optional({ nullable: true })
    .custom((value) => {
      if (!isValidDate(value)) {
        throw new Error('Invalid due date');
      }
      return true;
    }),
];
