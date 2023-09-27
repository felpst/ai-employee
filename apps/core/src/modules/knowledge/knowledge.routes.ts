import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import knowledgeController from './knowledge.controller';

const router: Router = express.Router();

router.post('/', authMiddleware, knowledgeController.create);
router.get('/', authMiddleware, knowledgeController.find);
router.get(
  '/workspaces/:workspaceId',
  authMiddleware,
  knowledgeController.getAllFromWorkspace
);
router.get('/:id', authMiddleware, knowledgeController.getById);
router.put('/:id', authMiddleware, knowledgeController.update);
router.delete('/:id', authMiddleware, knowledgeController.delete);

export default router;
