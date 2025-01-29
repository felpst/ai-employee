import crypto from 'crypto';
import { Request } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback, Options } from 'multer';
import os from 'os';
import path from 'path';
import FileUtils from '../utils/file.utils';

export default {
  // Max size: 15MB
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req: Request, file: any, cb: FileFilterCallback) => {
    if (FileUtils.getAcceptedFileType().includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(os.tmpdir(), 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const hash = crypto
        .createHash('sha256')
        .update(file.originalname + Date.now())
        .digest('hex');
      const newName = `${hash}_${file.originalname}`;
      cb(null, newName);
    },
  }),
} as Options;
