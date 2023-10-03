import { Knowledge } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

export class KnowledgeController extends ModelController<typeof Knowledge> {
  constructor() {
    super(Knowledge);
  }

  public async getAllFromWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: string = req.params.workspaceId;
      const knowledges = await Knowledge.find({ workspace: id });
      res.json(knowledges);
    } catch (error) {
      next(error);
    }
  }
}

export default new KnowledgeController();
