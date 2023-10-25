/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AIEmployee, User, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ModelController from '../../controllers/model.controller';
import UploadUtils from '../../utils/upload.utils';

export class WorkspaceController extends ModelController<typeof Workspace> {
  constructor() {
    super(Workspace);
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
        const { users, usersEmails, employee } = data;
        const arrayUsers = Array.isArray(users) ? [...users] : [users];
        const arrayEmails = Array.isArray(usersEmails)
          ? [...usersEmails]
          : [usersEmails];
        const _id = new mongoose.Types.ObjectId();
        let photo = process.env.DEFAULT_PHOTO_URL;
        const [workspaceFile, employeeFile] = files;
        if (workspaceFile?.path) {
          photo = await UploadUtils.uploadFile(
            _id.toString(),
            workspaceFile,
            'workspaces'
          );
        }

        if (!data.createdBy) {
          data.createdBy = userId;
        }
        data.updatedBy = userId;
        const _users = await User.find({
          $or: [
            { _id: { $in: [...arrayUsers, userId] } },
            { email: { $in: arrayEmails } },
          ],
        });
        const doc = await Workspace.create({
          ...data,
          _id,
          users: _users,
          photo,
        });
        if (employee) {
          const _employeeId = new mongoose.Types.ObjectId();
          let avatarPhoto = process.env.DEFAULT_PHOTO_URL;
          if (employeeFile?.path) {
            avatarPhoto = await UploadUtils.uploadFile(
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
      console.log(req.files);
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
        data.photo = await UploadUtils.uploadFile(
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
