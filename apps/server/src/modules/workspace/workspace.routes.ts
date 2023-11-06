import express, { Router } from 'express';
import multer from 'multer';
import jsonParserMiddleware from '../../middlewares/jsonParserMiddleware';
import multerConfig from '../../middlewares/multerConfig';
import { authMiddleware } from '../auth/auth.middleware';
import workspaceController from './workspace.controller';

const router: Router = express.Router();

router.post(
  '/',
  authMiddleware,
  workspaceController.create
  );
  // TODO created a separeted route for upload files
// router.post(
//   '/',
//   authMiddleware,
//   multer(multerConfig).array('files', 2),
//   jsonParserMiddleware,
//   YupValidatorMiddleware(addWorkspace),
//   workspaceController.create
// );
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
  multer(multerConfig).single('photo'),
  jsonParserMiddleware,
  workspaceController.update
);
router.delete('/:id', authMiddleware, workspaceController.delete, workspaceController.deleteKnowledgeBaseMiddleware);

export default router;
