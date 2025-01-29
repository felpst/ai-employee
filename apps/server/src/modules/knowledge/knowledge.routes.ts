import express, { Router } from 'express';
import multer from 'multer';
import jsonParserMiddleware from '../../middlewares/jsonParserMiddleware';
import { checkPermissions } from '../../middlewares/permissions.validator';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import knowledgeController from './knowledge.controller';
import { addKnowledgeSchema } from './knowledge.schemas';

const router: Router = express.Router();

router.get('/', authMiddleware, knowledgeController.find);
router.get(
  '/workspaces/:workspaceId/ask',
  authMiddleware,
  knowledgeController.askQuestionUsingAll
);
router.get(
  '/workspaces/:workspaceId',
  authMiddleware,
  knowledgeController.getAllFromWorkspace
);
router.get('/:id', authMiddleware, knowledgeController.getById);
router.post(
  '/',
  authMiddleware,
  multer().single('file'),
  jsonParserMiddleware,
  YupValidatorMiddleware(addKnowledgeSchema),
  // knowledgeController.createKnowledgeBaseDocument,
  knowledgeController.addOpenAIFile,
  knowledgeController.create
);
router.put(
  '/:id',
  authMiddleware,
  checkPermissions,
  multer().single('file'),
  jsonParserMiddleware,
  // knowledgeController.updateKnowledgeBaseDocument,
  knowledgeController.replaceOpenAIFile,
  knowledgeController.update
);
router.delete(
  '/:id',
  authMiddleware,
  checkPermissions,
  // knowledgeController.deleteKnowledgeBaseDocument,
  knowledgeController.deleteOpenAIFile,
  knowledgeController.delete
);
router.get(
  '/:id/ask',
  authMiddleware,
  knowledgeController.askQuestionById
);
router.patch('/:id/scheduled-update', knowledgeController.cronUpdate);

export default router;
