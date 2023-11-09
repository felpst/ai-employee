import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import workspaceController from './workspace.controller';

const router: Router = express.Router();

router.post('/', authMiddleware, workspaceController.create);
router.get(
  '/',
  authMiddleware,
  workspaceController.filterByUser,
  workspaceController.find
);
router.get('/:id', authMiddleware, workspaceController.getById);
router.put(
  '/:id',
  authMiddleware,
  workspaceController.fillUsers,
  workspaceController.update
);
router.delete(
  '/:id',
  authMiddleware,
  workspaceController.delete,
  workspaceController.deleteKnowledgeBaseMiddleware
);

export default router;
