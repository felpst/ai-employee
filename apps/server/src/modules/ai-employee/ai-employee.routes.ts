import express, { Router } from 'express';
import multer from 'multer';
import jsonParserMiddleware from '../../middlewares/jsonParserMiddleware';
import multerConfig from '../../middlewares/multerConfig';
import { authMiddleware } from '../auth/auth.middleware';
import employeeController from './ai-employee.controller';

const router: Router = express.Router();

router.post(
  '/',
  authMiddleware,
  // YupValidatorMiddleware(addEmployeeSchema),
  employeeController.create
);
router.get('/', authMiddleware, employeeController.find);
router.get('/:id', authMiddleware, employeeController.getById);
router.put(
  '/:id',
  authMiddleware,
  multer(multerConfig).single('avatar'),
  jsonParserMiddleware,
  employeeController.update
);
router.delete('/:id', authMiddleware, employeeController.delete);

export default router;
