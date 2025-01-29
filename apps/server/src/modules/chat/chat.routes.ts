import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import chatController from './chat.controller';

const router: Router = express.Router();

router.post('/', authMiddleware, chatController.create);
router.get('/', authMiddleware, chatController.find);
router.get('/:id', authMiddleware, chatController.getById);
router.put('/:id', authMiddleware, chatController.update);
router.delete('/:id', authMiddleware, chatController.delete);

export default router;
