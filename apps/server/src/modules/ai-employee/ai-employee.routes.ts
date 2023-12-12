import express, { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import employeeController from './ai-employee.controller';
import callsRoutes from './calls/ai-employee-calls.routes';


const router: Router = express.Router();

router.post('/', authMiddleware, employeeController.create);
router.get('/', authMiddleware, employeeController.find);
router.get('/:id', authMiddleware, employeeController.getById);
router.put('/:id', authMiddleware, employeeController.update);
router.delete('/:id', authMiddleware, employeeController.delete);
router.use('/calls', callsRoutes);

export default router;
