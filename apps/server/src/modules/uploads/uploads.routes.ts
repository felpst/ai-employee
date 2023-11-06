import express, { Router } from 'express';
import multer from 'multer';
import jsonParserMiddleware from '../../middlewares/jsonParserMiddleware';
import multerConfig from '../../middlewares/multerConfig';
import YupValidatorMiddleware from '../../middlewares/yup.validator';
import { authMiddleware } from '../auth/auth.middleware';
import uploadsController from './uploads.controller';
import { singleUpload } from './uploads.schemas';

const router: Router = express.Router();

router.post(
  '/single',
  authMiddleware,
  multer(multerConfig).single('file'),
  jsonParserMiddleware,
  YupValidatorMiddleware(singleUpload),
  uploadsController.single
);

export default router;
