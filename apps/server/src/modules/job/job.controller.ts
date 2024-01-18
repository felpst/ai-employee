import { AIEmployee } from '@cognum/ai-employee';
import { RepositoryHelper } from '@cognum/helpers';
import { IAIEmployee, IJob, IUser } from '@cognum/interfaces';
import { Job, User } from '@cognum/models';
import { JobService } from '@cognum/tools';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

export class JobController extends ModelController<typeof Job> {
  constructor() {
    super(Job);
  }

  public async cron(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const job: Partial<IJob> = req.body as Partial<IJob>;

      // Stop scheduler on Delete
      if (req.method === 'DELETE') {
        const doc = await Job.findById(jobId);
        await JobService.schedulerStop(doc);
        return next();
      }

      // Check User
      const user: IUser = (req as any).user;
      if (!user) return next({ error: 'Invalid user' });

      // Check AI Employee
      const aiEmployeeId = req.body.aiEmployee;
      if (!aiEmployeeId) return next({ error: 'Invalid AI Employee ID' });
      const aiEmployee: IAIEmployee = await new RepositoryHelper(AIEmployee, user._id).getById(aiEmployeeId) as IAIEmployee;
      if (!aiEmployee) return next({ error: 'Invalid AI Employee' });

      // Service
      const jobService = new JobService({ user, aiEmployee });

      // Stop scheduler on Pause
      if (job.status === 'stopped') {
        const doc = await Job.findById(jobId);
        await JobService.schedulerStop(doc);
        req.body = job;
        return next();
      }

      if (job.scheduler && job.scheduler.frequency) {
        await jobService.schedulerRun(job);
      }
      req.body = job;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const force = req.query.force === 'true';

      // Job
      const job = await Job.findById(id);
      if (!job) { throw new Error('Job not found'); }

      // User
      const user: IUser = await User.findById(job.createdBy) as IUser;
      if (!user) { throw new Error('User not found'); }

      // AI Employee
      const aiEmployee: IAIEmployee = await AIEmployee.findById(job.aiEmployee) as IAIEmployee;
      if (!aiEmployee) { throw new Error('AI Employee not found'); }

      // Execute
      const result = await new JobService({ user, aiEmployee }).execute(job, force);

      return res.status(200).json({ message: 'Job executed', result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new JobController();
