import express, { Router } from 'express';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import userController from './user.controller';
import { addUserSchema } from './user.schemas';

const router: Router = express.Router();

router.post(
  '/common',
  YupValidatorMiddleware(addUserSchema),
  userController.createCommonUser
);
router.post('/', authMiddleware, userController.create);
router.get('/', authMiddleware, userController.find);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.delete);

export default router;
