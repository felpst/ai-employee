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

export default router;
