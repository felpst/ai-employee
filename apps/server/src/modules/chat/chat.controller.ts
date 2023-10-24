import { Chat } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

export class ChatController extends ModelController<typeof Chat> {
  constructor() {
    super(Chat);
  }

  public async getAllFromWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: string = req.params.workspaceId;
      const chats = await Chat.find({ workspace: id });
      res.json(chats);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
