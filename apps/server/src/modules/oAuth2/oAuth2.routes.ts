import express, { Router } from 'express';
import oAuth2Controller from './oAuth2.controller';

const router: Router = express.Router();

router.get('/auth2/google-calendar', oAuth2Controller.getAuthUrl);
router.get('/auth2/google/callback', oAuth2Controller.getToken);


export default router;
