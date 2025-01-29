import { IWorkspace } from '@cognum/interfaces';
import KnowledgeBase from '@cognum/knowledge-base';
import { User, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import ModelController from '../../controllers/model.controller';
import { EmailService } from '../../services/email.service';
import { registerEmailTemplate } from '../../utils/templates/register'; 


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
        if (_id.toString() === userId) return ({ user: _id, permission: 'Admin' });
        const userPermission = usersInData.find(({ user }: any) => user === email);
        const permission = userPermission ? userPermission.permission : 'Employee';
        return ({ user: _id, permission });
      });
      req.body.users = _users;
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

  public async setupKnowledgeBaseCollection(
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const workspaceId = new mongoose.mongo.ObjectId();
      await new KnowledgeBase(workspaceId.toString()).setupCollection();

      req.body['_id'] = workspaceId;
      next();
    } catch (error) {
      next(error);
    }
  }

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

  async deleteOpenAIAssistant(req: Request, res: Response, next: NextFunction) {
    try {
      const openai = new OpenAI();
      const { openaiAssistantId }: IWorkspace = res.locals.data;

      await openai.beta.assistants.del(openaiAssistantId);

      next();
    } catch (error) {
      next(error);
    }
  }

  public async sendEmailToMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    req.body.email = req.body.email.toLowerCase();
    req.body.active = true;

    try {
      await EmailService.send({
        to: req.body.email,
        subject: 'Welcome to Cognum!',
        html: registerEmailTemplate,
      })
    } catch (error) {
      next(error)
    }
    next();
  }
  
}

export default new WorkspaceController();
