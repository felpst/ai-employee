import express, { Router } from 'express';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import knowledgeController from './knowledge.controller';
import { addKnowledgeSchema } from './knowledge.schemas';

const router: Router = express.Router();

router.post(
  '/',
  authMiddleware,
  YupValidatorMiddleware(addKnowledgeSchema),
  knowledgeController.create
);
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
