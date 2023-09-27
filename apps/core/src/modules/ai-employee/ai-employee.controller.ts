import { AIEmployee, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

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
        const doc = await AIEmployee.create({
          ...data,
          workspaces: _workspaces,
        });
        docs.push(doc);
      }
      res.status(201).json(docs.length > 1 ? docs : docs[0]);
    } catch (error) {
      next(error);
    }
  }
}

export default new AiEmployeeController();
