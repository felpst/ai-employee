import express, { Router } from 'express';
import mailController from './mail.controller';

const router: Router = express.Router();

router.post('/check', mailController.execute);

export default router;
