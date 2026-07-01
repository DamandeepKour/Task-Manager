import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateCreateTask, validateUpdateTask } from '../validations/task.validation.js';

const router = Router();

router.use(authenticate);

router.post('/', validateCreateTask, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
