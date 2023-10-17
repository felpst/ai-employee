import { AIEmployee, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ModelController from '../../controllers/model.controller';
import UploadUtils from '../../utils/upload.utils';

export class AiEmployeeController extends ModelController<typeof AIEmployee> {
  constructor() {
    super(AIEmployee);
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
          avatar = await UploadUtils.uploadFile(
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
        data.avatar = await UploadUtils.uploadFile(
          employeeId,
          req.file,
          'employees'
        );
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
}

export default new AiEmployeeController();
