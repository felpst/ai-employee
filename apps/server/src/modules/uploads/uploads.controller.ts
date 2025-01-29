import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import UploadUtils from '../../utils/upload.utils';

export class UploadsController {
  public async single(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file || !req.file?.path) {
        res.status(400).json({
          error: ['Missing required "file" multipart/form-data to upload'],
        });
      }
      const { folder, filename, parentId } = req.body;
      const file = req.file;
      const _id = parentId || new mongoose.Types.ObjectId();
      const url = await UploadUtils.uploadFile(
        _id.toString(),
        file,
        folder,
        filename
      );
      res.json({ url });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadsController();
