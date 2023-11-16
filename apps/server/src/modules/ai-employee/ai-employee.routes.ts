import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import employeeController from './ai-employee.controller';

const router: Router = express.Router();

router.post('/', authMiddleware, employeeController.create);
router.get('/', authMiddleware, employeeController.find);
router.get('/:id', authMiddleware, employeeController.getById);
router.put('/:id', authMiddleware, employeeController.update);
router.delete('/:id', authMiddleware, employeeController.delete);

export default router;
