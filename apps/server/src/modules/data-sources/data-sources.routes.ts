import express, { Router } from 'express';
import multer from 'multer';
import multerConfig from '../../middlewares/multerConfig';
import { authMiddleware } from '../auth/auth.middleware';
import dataSourcesController from './data-sources.controller';

const router: Router = express.Router();

router.post(
  '/upload',
  authMiddleware,
  multer(multerConfig).single('file'),
  dataSourcesController.upload
);
router.post('/', authMiddleware, dataSourcesController.create);
router.get('/', authMiddleware, dataSourcesController.find);
router.get('/:id', authMiddleware, dataSourcesController.getById);
router.put('/:id', authMiddleware, dataSourcesController.update);
router.delete('/:id', authMiddleware, dataSourcesController.delete);
router.post('/teste', authMiddleware, dataSourcesController.teste);

export default router;
