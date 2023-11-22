import { IWorkspace } from '@cognum/interfaces';
import KnowledgeBase from '@cognum/knowledge-base';
import { User, Workspace } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import OpenAI from 'openai';
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
    req.query.filter['users'] = { $in: req['userId'] };
    next();
  }

  public async fillUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (req.body.users) {
      const userId = req['userId'];
      const users = req.body.users;
      req.body.users = await User.find({
        $or: [{ _id: { $in: [userId] } }, { email: { $in: users } }],
      });
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

  async createOpenAIAssistant(req: Request, _: Response, next: NextFunction) {
    try {
      const openai = new OpenAI();
      const assistant = await openai.beta.assistants.create({ model: "gpt-4-1106-preview" });

      req.body = {
        ...req.body,
        openaiAssistantId: assistant.id,
      };
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
}

export default new WorkspaceController();
