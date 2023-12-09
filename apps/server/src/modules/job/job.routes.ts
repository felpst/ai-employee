import express, { Router } from 'express';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import { userMiddleware } from '../user/user.middleware';
import jobController from './job.controller';
import { addJobSchema } from './job.schemas';

const router: Router = express.Router();

router.post('/', authMiddleware, userMiddleware, YupValidatorMiddleware(addJobSchema), jobController.cron, jobController.create);
router.get('/', authMiddleware, jobController.find);
router.get('/:id', authMiddleware, jobController.getById);
router.put('/:id', authMiddleware, userMiddleware, jobController.cron, jobController.update);
router.delete('/:id', authMiddleware, jobController.cron, jobController.delete);
router.post('/:id/execute', jobController.execute);

export default router;
