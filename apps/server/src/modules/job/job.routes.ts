import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { userMiddleware } from '../user/user.middleware';
import callRoutes from './calls/jobs-calls.routes';
import jobController from './job.controller';

const router: Router = express.Router();

router.use('/calls', callRoutes);
router.post('/', authMiddleware, userMiddleware, jobController.cron, jobController.create);
router.get('/', authMiddleware, jobController.find);
router.get('/:id', authMiddleware, jobController.getById);
router.put('/:id', authMiddleware, userMiddleware, jobController.cron, jobController.update);
router.delete('/:id', authMiddleware, userMiddleware, jobController.cron, jobController.delete);
router.post('/:id/execute', jobController.execute);

export default router;
