import express, { Router } from 'express';
import knowledgeEventEmitterHandler from '../../middlewares/knowledge-event-emitter.handler';
import { authMiddleware } from '../auth/auth.middleware';
import knowledgeController from './knowledge.controller';

const router: Router = express.Router();

router.get('/', authMiddleware, knowledgeController.find);
router.get(
  '/workspaces/:workspaceId',
  authMiddleware,
  knowledgeController.getAllFromWorkspace
);
router.get('/:id', authMiddleware, knowledgeController.getById);

router.use('*', knowledgeEventEmitterHandler) // all routes from here will use this handler

router.post('/', authMiddleware, knowledgeController.create);
router.put('/:id', authMiddleware, knowledgeController.update);
router.delete('/:id', authMiddleware, knowledgeController.delete);

export default router;
