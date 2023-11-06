import KnowledgeBase from '@cognum/knowledge-base';
import { User, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';
import UploadUtils from '../../utils/upload.utils';

export class WorkspaceController extends ModelController<typeof Workspace> {
  constructor() {
    super(Workspace);
  }

  // public async create(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const dataset = Array.isArray(req.body) ? [...req.body] : [req.body];
  //     const userId = req['userId'];
  //     const docs = [];
  //     for (const data of dataset) {
  //       const { users } = data;
  //       const usersEmails = Array.isArray(users) ? [...users] : [users];

  //       if (!data.createdBy) {
  //         data.createdBy = userId;
  //       }
  //       data.updatedBy = userId;

  //       const _users = await User.find({
  //         $or: [{ _id: { $in: [userId] } }, { email: { $in: usersEmails } }],
  //       });

  //       const doc = await Workspace.create({ ...data, users: _users });
  //       await new KnowledgeBase(doc._id.toString()).setupCollection();
  //       docs.push(doc);
  //     }
  //     res.status(201).json(docs.length > 1 ? docs : docs[0]);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

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
        const { filename } = req.file;
        const extension = filename.split('.')?.pop() || 'png';
        const uploadedName = `photo.${extension}`;
        data.photo = await UploadUtils.uploadFile(
          workspaceId,
          req.file,
          'workspaces',
          uploadedName
        );
      }
      if (data.users) {
        const userId = req['userId'];
        data.users = await User.find({
          $or: [{ _id: { $in: [userId] } }, { email: { $in: data.users } }],
        });
      }

      const updated = await Workspace.findByIdAndUpdate(workspaceId, data, {
        returnDocument: 'after',
        runValidators: true,
        populate: 'users',
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  public async filterByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.query.filter) req.query.filter = {};
    req.query.filter['users'] = { $in: req['userId'] };
    next();
  }

  // public async delete(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const taskId: string = req.params.id;
  //     const deletedTask = await Workspace.findByIdAndDelete(taskId);

  //     if (!deletedTask) {
  //       const error: any = new Error('Document not found');
  //       error.status = 404;
  //       throw error;
  //     } else await new KnowledgeBase(taskId).deleteCollection();

  //     res.json(deletedTask);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  public async deleteKnowledgeBaseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const workspaceId: string = req.params.id;
      await new KnowledgeBase(workspaceId).deleteCollection();
      next()
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkspaceController();
