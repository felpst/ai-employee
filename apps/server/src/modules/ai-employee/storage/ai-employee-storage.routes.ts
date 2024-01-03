import express, { Router } from 'express';
import aiEmployeeStorageController from './ai-employee-storage.controller';

const router: Router = express.Router();

router.get('/:id', aiEmployeeStorageController.list);
router.get('/:id/files/:filename', aiEmployeeStorageController.get);

export default router;
