import { AIEmployee } from '@cognum/ai-employee';
import ModelController from '../../controllers/model.controller';
import { NextFunction, Request, Response } from 'express';

export class AiEmployeeController extends ModelController<typeof AIEmployee> {
  constructor() {
    super(AIEmployee);
  }

  public async filterByEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.query.filter) req.query.filter = {};
    const { filter } = req.query ?? { filter: {} };
    if (filter['aiEmployee']) {
      const ids = filter['aiEmployee'].split(',');
      req.query.filter['aiEmployee'] = { $in: ids };
    }
    next();
  }
}

export default new AiEmployeeController();
