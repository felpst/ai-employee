import KnowledgeBase from '@cognum/knowledge-base';
import { User, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

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
      const docs = [];
      for (const data of dataset) {
        const { users } = data;
        const arrayUsers = Array.isArray(users) ? [...users] : [users];
        if (!data.createdBy) {
          data.createdBy = userId;
        }
        data.updatedBy = userId;
        const _users = await User.find({
          _id: { $in: [...arrayUsers, userId] },
        });
        const doc = await Workspace.create({ ...data, users: _users });
        await new KnowledgeBase(doc._id.toString()).createIndex();

        docs.push(doc);
      }
      res.status(201).json(docs.length > 1 ? docs : docs[0]);
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

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const taskId: string = req.params.id;
      const deletedTask = await Workspace.findByIdAndDelete(taskId);

      if (!deletedTask) {
        const error: any = new Error('Document not found');
        error.status = 404;
        throw error;
      } else {
        await new KnowledgeBase(taskId).deleteIndex();
      }

      res.json(deletedTask);
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkspaceController();
