import KnowledgeBase from '@cognum/knowledge-base';
import { User, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

export class WorkspaceController extends ModelController<typeof Workspace> {
  constructor() {
    super(Workspace);
  }

  public async filterByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.query.filter) req.query.filter = {};
    req.query.filter['users.user'] = { $in: req['userId'] };
    next();
  }

  public async fillUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (req.body.users) {
      const userId = req['userId'];
      const usersInData = req.body.users;
      const emails = usersInData.map(({ user }) => user);

      const usersInfo = await User.find({
        $or: [{ _id: { $in: [userId] } }, { email: { $in: emails } }],
      });
      const _users = usersInfo.map((userData) => {
        const { email, _id } = userData.toObject();
        const userPermission = usersInData.find(({ user }: any) => user === email);
        const permission = userPermission ? userPermission.permission : 'Employee'
        return ({ user: _id, permission });
      });
      req.body.users = _users
    }
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
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkspaceController();
