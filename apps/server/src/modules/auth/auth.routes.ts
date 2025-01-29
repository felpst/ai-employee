import express, { Router } from 'express';
import authController from './auth.controller';
import { authMiddleware } from './auth.middleware';

const router: Router = express.Router();

router.post('/login', authController.login);
router.get('/protected', authController.protected);
router.post('/logout', authController.logout);
router.get('/email', authController.getUserByEmail);
router.get('/user', authMiddleware, authController.getUser);

export default router;
