import express, { Router } from 'express';
import { authMiddleware } from '../../auth/auth.middleware';
import jobCallsController from './jobs-calls.controller';

const router: Router = express.Router();

router.get('/', authMiddleware, jobCallsController.find);

export default router;
