import express from 'express';
import { body } from 'express-validator';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from './validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.patch(
  '/:id/role',
  authorize('admin'),
  [body('role').isIn(['admin', 'member']).withMessage('Role must be admin or member')],
  validate,
  updateUserRole
);

export default router;
