import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import messageController from './message.controller';

const router: Router = express.Router();

router.post('/', authMiddleware, messageController.create);
router.get('/', authMiddleware, messageController.find);
router.get('/:id', authMiddleware, messageController.getById);
router.put('/:id', authMiddleware, messageController.update);
router.patch('/:id', authMiddleware, messageController.addFeedback);
router.put(
  '/:id/feedback/:feedbackId',
  authMiddleware,
  messageController.updateFeedback
);
router.delete('/:id', authMiddleware, messageController.delete);

export default router;
