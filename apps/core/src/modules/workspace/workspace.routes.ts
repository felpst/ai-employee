import express, { Router } from 'express';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import workspaceController from './workspace.controller';
import { addWorkspace } from './workspace.schemas';

const router: Router = express.Router();

router.post(
  '/',
  authMiddleware,
  YupValidatorMiddleware(addWorkspace),
  workspaceController.create
);
router.get('/', authMiddleware, workspaceController.find);
router.get('/:id', authMiddleware, workspaceController.getById);
router.put('/:id', authMiddleware, workspaceController.update);
router.delete('/:id', authMiddleware, workspaceController.delete);

export default router;
