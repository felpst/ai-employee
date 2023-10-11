import { User, Workspace } from '@cognum/models';
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

export class WorkspaceController extends ModelController<typeof Workspace> {
  constructor() {
    super(Workspace);
  }

  private async _uploadFile(
    id: string,
    originalName: string,
    filePath: string
  ) {
    googleStorageBucket.getFiles({});
    try {
      const hash = crypto
        .createHash('sha256')
        .update(originalName + Date.now())
        .digest('hex');
      const newName = `${hash}_${originalName}`;
      const destinationPath = `workspaces/${id}/${newName}`;
      await googleStorageBucket.upload(filePath, {
        destination: destinationPath,
      });
      const file = await googleStorageBucket.file(destinationPath);
      await file.acl.add({ entity: 'allUsers', role: 'READER' });

      // delete file from local storage
      fs.unlinkSync(filePath);

      return `https://storage.googleapis.com/${googleStorageBucket.name}/${destinationPath}`;
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
        const { users } = data;
        const arrayUsers = Array.isArray(users) ? [...users] : [users];
        const _id = new mongoose.Types.ObjectId();
        const profilePhoto = req.file?.path
          ? await this._uploadFile(
              _id.toString(),
              req.file.originalname,
              req.file.path
            )
          : process.env.WORKSPACE_PHOTO_URL;

        if (!data.createdBy) {
          data.createdBy = userId;
        }
        data.updatedBy = userId;
        const _users = await User.find({
          _id: { $in: [...arrayUsers, userId] },
        });
        const doc = await Workspace.create({
          ...data,
          _id,
          users: _users,
          profilePhoto,
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
      const workspaceId: string = req.params.id;
      const data = req.body;
      data.updatedBy = req['userId'];
      if (req.file?.path) {
        data.profilePhoto = await this._uploadFile(
          workspaceId,
          req.file.originalname,
          req.file.path
        );
      }

      const updated = await Workspace.findByIdAndUpdate(workspaceId, data, {
        returnDocument: 'after',
        runValidators: true,
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  public async findByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req['userId'];
      const sort = (req.query.sort as string) || [];
      const list = await Workspace.find({ users: { $in: [userId] } }).sort(
        sort
      );
      res.json(list);
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

export default new WorkspaceController();
