import express, { Router } from 'express';
import { checkPermissions } from '../../middlewares/permissions.validator';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import knowledgeController from './knowledge.controller';
import { addKnowledgeSchema } from './knowledge.schemas';

const router: Router = express.Router();

router.get('/', authMiddleware, knowledgeController.find);
router.get(
  '/workspaces/:workspaceId',
  authMiddleware,
  knowledgeController.getAllFromWorkspace
);
router.get('/:id', authMiddleware, knowledgeController.getById);
router.post(
  '/',
  authMiddleware,
  YupValidatorMiddleware(addKnowledgeSchema),
  knowledgeController.createKnowledgeBaseDocument,
  knowledgeController.create
);
router.put(
  '/:id',
  authMiddleware,
  checkPermissions,
  knowledgeController.updateKnowledgeBaseDocument,
  knowledgeController.update
);
router.delete(
  '/:id',
  authMiddleware,
  checkPermissions,
  knowledgeController.deleteKnowledgeBaseDocument,
  knowledgeController.delete
);

export default router;
