import { AIEmployee } from '@cognum/ai-employee';
import { IAIEmployee, IJob, IUser } from '@cognum/interfaces';
import { Job, User } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ModelController from '../../controllers/model.controller';
import { textToCron } from '../../helpers/cron.helper';
import SchedulerService from '../../services/scheduler.service';

export class JobController extends ModelController<typeof Job> {
  constructor() {
    super(Job);
  }

  public async cron(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const job: Partial<IJob> = req.body as Partial<IJob>;

      // Stop cron
      if (req.method === 'DELETE') {
        try {
          const doc = await Job.findById(jobId);
          await new SchedulerService().deleteJob(doc.cron.name);
        } catch (error) { }
        next(); return;
      }
      if ((job.status === 'stopped' || !job.frequency) && job.cron?.name) {
        try {
          await new SchedulerService().deleteJob(job.cron.name);
        } catch (error) { }
        job.cron = undefined;
        req.body = job;
        next(); return;
      }

      const user: IUser = (req as any).user;
      if (!user) next({ error: 'Invalid user' });

      if (!job.frequency) { next(); return; }
      if (!job._id) {
        job._id = new ObjectId().toHexString();
      }

      // Create or Update
      if (!job.cron?.name) {
        job.cron = {
          name: `job-execute-${job._id}`,
          schedule: await textToCron(job.frequency),
          timeZone: user.timezone || 'America/Sao_Paulo',
          httpTarget: {
            httpMethod: 'POST',
            uri: `${process.env.SERVER_URL}/jobs/${job._id}/execute`,
          },
        };
        await new SchedulerService().createJob(job.cron);
      } else {
        job.cron.schedule = await textToCron(job.frequency);
        job.cron.timeZone = user.timezone || 'America/Sao_Paulo';
        await new SchedulerService().updateJob(job.cron);
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

      // Job
      const job = await Job.findById(id);
      if (!job) { throw new Error('Job not found'); }
      if (job.status !== 'running') {
        return res.status(200).json({ message: 'Job is not running' });
      }

      // User
      const user: IUser = await User.findById(job.createdBy.toString()) as IUser;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // AI Employee
      const aiEmployee = await AIEmployee.findById(job.aiEmployee) as IAIEmployee;
      if (!aiEmployee) {
        return res.status(404).json({ error: 'AIEmployee not found' });
      }

      // Execute
      const call = await aiEmployee.call({
        input: job.instructions,
        context: {
          job: {
            name: job.name,
            frequency: job.frequency,
            status: job.status,
            cron: {
              name: job.cron?.name,
              schedule: job.cron?.schedule,
              timeZone: job.cron?.timeZone,
            },
            instructions: job.instructions
          }
        },
        createdBy: user._id.toString(),
        updatedBy: user._id.toString()
      })
      const callResult = await new Promise((resolve, reject) => {
        try {
          call.run().subscribe(call => {
            if (call.status === 'done') {
              resolve(call);
            }
          })
        } catch (error) {
          reject(error);
        }
      });
      return res.status(200).json({ message: 'Job executed', callResult });
    } catch (error) {
      console.error(error);
      next(error)
    }
  }
}

export default new JobController();
