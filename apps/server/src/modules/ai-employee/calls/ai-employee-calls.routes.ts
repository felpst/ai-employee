import express, { Router } from 'express';
import { authMiddleware } from '../../auth/auth.middleware';
import aiEmployeeCallsController from './ai-employee-calls.controller';

const router: Router = express.Router();

router.get('/', authMiddleware, aiEmployeeCallsController.find);

export default router;
