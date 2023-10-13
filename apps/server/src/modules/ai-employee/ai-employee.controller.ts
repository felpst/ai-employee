import { AIEmployee, Workspace } from '@cognum/models';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import os from 'os';
import path from 'path';
import ModelController from '../../controllers/model.controller';

const gc = new Storage({
  keyFilename: 'cognum.secrets.json',
  projectId: 'cognum',
});

const googleStorageBucket = gc.bucket('cognum-data-sources');

export class AiEmployeeController extends ModelController<typeof AIEmployee> {
  constructor() {
    super(AIEmployee);
  }

  private async _uploadFile(
    id: string,
    file: Express.Multer.File,
    folder: string
  ) {
    try {
      const hash = crypto
        .createHash('sha256')
        .update(file.originalname + Date.now())
        .digest('hex');
      const newName = `${hash}_${file.originalname}`;
      const destination = `${folder}/${id}/${newName}`;
      await googleStorageBucket.upload(file.path, { destination });
      const upload = await googleStorageBucket.file(destination);
      await upload.acl.add({ entity: 'allUsers', role: 'READER' });

      // delete file from local storage
      fs.unlinkSync(file.path);

      return `https://storage.googleapis.com/${googleStorageBucket.name}/${destination}`;
    } catch (error) {
      const { errors } = error;
      console.log('An error ocurring in upload file: ', { error, errors });
      return '';
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataset = Array.isArray(req.body) ? [...req.body] : [req.body];
      const userId = req['userId'];
      const docs = [];
      for (const data of dataset) {
        const { workspaces } = data;
        const arrayWorkspaces = Array.isArray(workspaces)
          ? [...workspaces]
          : [workspaces];
        if (!data.createdBy) {
          data.createdBy = userId;
        }
        data.updatedBy = userId;
        const _workspaces = await Workspace.find({
          _id: { $in: arrayWorkspaces },
        });
        const _id = new mongoose.Types.ObjectId();
        let avatar = process.env.DEFAULT_PHOTO_URL;
        if (req.file?.path) {
          avatar = await this._uploadFile(
            _id.toString(),
            req.file,
            'employees'
          );
        }
        const doc = await AIEmployee.create({
          ...data,
          _id,
          avatar,
          workspaces: _workspaces,
        });
        docs.push(doc);
      }
      res.status(201).json(docs.length > 1 ? docs : docs[0]);
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employeeId = req.params.id;
      const data = req.body;
      data.updatedBy = req['userId'];
      if (req.file?.path) {
        data.avatar = await this._uploadFile(employeeId, req.file, 'employees');
      }

      const updated = await AIEmployee.findByIdAndUpdate(employeeId, data, {
        returnDocument: 'after',
        runValidators: true,
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  get middleware() {
    const storage = multer.diskStorage({
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
    });

    const upload = multer({ storage: storage });
    return upload;
  }
}

export default new AiEmployeeController();
