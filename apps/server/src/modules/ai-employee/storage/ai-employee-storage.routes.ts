import express, { Router } from 'express';
import aiEmployeeStorageController from './ai-employee-storage.controller';
import multer from 'multer';
import multerConfig from '../../../middlewares/multerConfig';
import jsonParserMiddleware from '../../../middlewares/jsonParserMiddleware';

const router: Router = express.Router();

router.get('/:id', aiEmployeeStorageController.list);
router.get('/:id/files/:filename', aiEmployeeStorageController.read);
router.post(
  '/:id/files',
  multer(multerConfig).single('file'),
  aiEmployeeStorageController.create
);
router.put(
  '/:id/files',
  multer(multerConfig).single('file'),
  jsonParserMiddleware,
  aiEmployeeStorageController.update
);
router.delete('/:id/files/:filename', aiEmployeeStorageController.delete);

export default router;
