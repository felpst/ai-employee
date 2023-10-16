/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AIEmployee, User, Workspace } from '@cognum/models';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
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
      // @ts-ignore
      const files = req.files ? Array.from(req.files) : [];
      const docs = [];
      for (const data of dataset) {
        const { users, employee } = data;
        const arrayUsers = Array.isArray(users) ? [...users] : [users];
        const _id = new mongoose.Types.ObjectId();
        let profilePhoto = process.env.DEFAULT_PHOTO_URL;
        const [profileFile, employeeFile] = files;
        if (profileFile?.path) {
          profilePhoto = await this._uploadFile(
            _id.toString(),
            profileFile,
            'workspaces'
          );
        }

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
        if (employee) {
          const _employeeId = new mongoose.Types.ObjectId();
          let avatarPhoto = process.env.DEFAULT_PHOTO_URL;
          if (employeeFile?.path) {
            avatarPhoto = await this._uploadFile(
              _employeeId.toString(),
              employeeFile,
              'employees'
            );
          }
          await AIEmployee.create({
            ...employee,
            _id: _employeeId,
            workspaces: [doc._id],
            avatar: avatarPhoto,
            createdBy: userId,
            updatedBy: userId,
          });
        }
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
      const workspaceId = req.params.id;
      const data = req.body;
      data.updatedBy = req['userId'];
      if (req.file?.path) {
        data.profilePhoto = await this._uploadFile(
          workspaceId,
          req.file,
          'workspaces'
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
}

export default new WorkspaceController();
