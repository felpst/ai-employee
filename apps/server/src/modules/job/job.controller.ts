import { AIEmployee } from '@cognum/ai-employee';
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
        data['cron'] = await textToCron(frequency);
      }
      req.body = data;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const job = await Job.findById(id);
      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }
      const { status } = job
      if (status !== 'running') {
        res.status(400).json({ error: 'Job not running' });
        return;
      }
      const { employee } = job
      const aiEmployee = await AIEmployee.findById(employee);
      if (!aiEmployee) {
        res.status(404).json({ error: 'AIEmployee not found' });
        return;
      }
      const { instructions } = job
      // TODO - Execute AIEmployee
      return res.status(201)
    } catch (error) {
      next(error)
    }
  }
}

export default new JobController();
