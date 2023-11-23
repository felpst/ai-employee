import express, { Router } from 'express';
import multer from 'multer';
import knowledgeEventEmitterHandler from '../../middlewares/knowledge-event-emitter.handler';
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

router.use('*', knowledgeEventEmitterHandler); // all routes from here will use this handler

router.post(
  '/',
  authMiddleware,
  YupValidatorMiddleware(addKnowledgeSchema),
  multer().single('file'),
  knowledgeController.addOpenAIFile,
  knowledgeController.create
);
router.put(
  '/:id',
  authMiddleware,
  checkPermissions,
  knowledgeController.deleteOpenAIFile,
  knowledgeController.addOpenAIFile,
  knowledgeController.update,
);
router.delete(
  '/:id',
  authMiddleware,
  checkPermissions,
  knowledgeController.deleteOpenAIFile,
  knowledgeController.delete,
);

export default router;
