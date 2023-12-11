import express, { Router } from 'express';
import testsController from './tests.controller';

const router: Router = express.Router();

router.post('/linkedinFindLeads', testsController.linkedinFindLeads);

export default router;
