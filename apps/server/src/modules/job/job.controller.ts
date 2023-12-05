import { Job } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';
import { textToCron } from '../../helpers/cron.helper';

export class JobController extends ModelController<typeof Job> {
  constructor() {
    super(Job);
  }

  public async parseCronFrequency(req: Request, _: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { frequency } = data
      if (frequency) {
        data['frequency'] = await textToCron(frequency);
      }
      req.body = data;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
