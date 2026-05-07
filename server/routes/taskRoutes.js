import express from 'express';
import { body } from 'express-validator';
import {
  createTask,
  deleteTask,
  getTaskStats,
  getTasks,
  updateTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from './validate.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getTaskStats);

router
  .route('/')
  .get(getTasks)
  .post(
    authorize('admin'),
    [
      body('title').trim().isLength({ min: 2 }).withMessage('Task title is required'),
      body('dueDate').isISO8601().withMessage('Valid due date is required'),
      body('project').isMongoId().withMessage('Valid project is required'),
      body('assignedTo').isMongoId().withMessage('Valid assignee is required'),
      body('status').optional().isIn(['todo', 'in-progress', 'completed']),
      body('priority').optional().isIn(['low', 'medium', 'high'])
    ],
    validate,
    createTask
  );

router
  .route('/:id')
  .patch(updateTask)
  .delete(authorize('admin'), deleteTask);

export default router;
