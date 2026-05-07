import express from 'express';
import { body } from 'express-validator';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from './validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(
    authorize('admin'),
    [
      body('name').trim().isLength({ min: 2 }).withMessage('Project name is required'),
      body('description').optional().trim().isLength({ max: 500 }),
      body('members').optional().isArray().withMessage('Members must be an array')
    ],
    validate,
    createProject
  );

router
  .route('/:id')
  .get(getProjectById)
  .put(authorize('admin'), updateProject)
  .delete(authorize('admin'), deleteProject);

export default router;
