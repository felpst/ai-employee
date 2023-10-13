import express, { Router } from 'express';
import jsonParserMiddleware from '../../middlewares/jsonParserMiddleware';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import employeeController from './ai-employee.controller';
import { addEmployeeSchema } from './ai-employee.schemas';

const router: Router = express.Router();

router.post(
  '/',
  authMiddleware,
  employeeController.middleware.single('avatar'),
  jsonParserMiddleware,
  YupValidatorMiddleware(addEmployeeSchema),
  employeeController.create
);
router.get('/', authMiddleware, employeeController.find);
router.get('/:id', authMiddleware, employeeController.getById);
router.put(
  '/:id',
  authMiddleware,
  employeeController.middleware.single('avatar'),
  jsonParserMiddleware,
  employeeController.update
);
router.delete('/:id', authMiddleware, employeeController.delete);

export default router;
