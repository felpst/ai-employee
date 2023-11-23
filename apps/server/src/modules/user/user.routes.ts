import express, { Router } from 'express';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import userController from './user.controller';
import {
  addUserSchema,
  recoveryPasswordSchema,
  recoveryRequestSchema,
} from './user.schemas';

const router: Router = express.Router();

router.post(
  '/register',
  YupValidatorMiddleware(addUserSchema),
  userController.sendEmail,
  userController.create
);
router.post('/', authMiddleware, userController.create);
router.get('/', authMiddleware, userController.find);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.delete);

// Verify tokens
router.get('/token/:tokenId', userController.verifyToken);
router.post('/token/:tokenId/resend', userController.resendTokenRequest);
router.post('/token/:tokenId/verify', userController.verifyUser);

// Recovery password
router.post(
  '/recovery',
  YupValidatorMiddleware(recoveryRequestSchema),
  userController.recoveryRequest
);
router.patch(
  '/recovery/:recoveryId',
  YupValidatorMiddleware(recoveryPasswordSchema),
  userController.recovery
);

export default router;
