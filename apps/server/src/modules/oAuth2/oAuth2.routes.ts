import express, { Router } from 'express';
import oAuth2Controller from './oAuth2.controller';

const router: Router = express.Router();

router.get('/google', oAuth2Controller.googleAuthUrl);
router.get('/google/callback', oAuth2Controller.getToken);

export default router;
