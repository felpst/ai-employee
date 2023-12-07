import express, { Router } from 'express';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import jobController from './job.controller';
import { addJobSchema } from './job.schemas';

const router: Router = express.Router();

router.post('/', authMiddleware, YupValidatorMiddleware(addJobSchema), jobController.parseCronFrequency, jobController.create);
router.get('/', authMiddleware, jobController.find);
router.get('/:id', authMiddleware, jobController.getById);
router.put('/:id', authMiddleware, jobController.parseCronFrequency, jobController.update);
router.delete('/:id', authMiddleware, jobController.delete);

export default router;
