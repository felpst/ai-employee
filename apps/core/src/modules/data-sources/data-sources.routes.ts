import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import dataSourcesController from './data-sources.controller';

const router: Router = express.Router();

router.post(
  '/upload',
  authMiddleware,
  dataSourcesController.middleware.single('file'),
  dataSourcesController.upload
);
router.post('/', authMiddleware, dataSourcesController.create);
router.get('/', authMiddleware, dataSourcesController.find);
router.get('/:id', authMiddleware, dataSourcesController.getById);
router.put('/:id', authMiddleware, dataSourcesController.update);
router.delete('/:id', authMiddleware, dataSourcesController.delete);

export default router;
