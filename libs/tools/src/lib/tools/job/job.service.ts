import { RepositoryHelper } from '@cognum/helpers';
import { IAIEmployeeCall, IJob } from "@cognum/interfaces";
import { Job } from "@cognum/models";
import { DynamicStructuredTool, Tool } from "@langchain/core/tools";
import { ObjectId } from "mongodb";
import { CronService } from '../cron';
import { SchedulerService } from '../scheduler/scheduler.service';
import { JobToolkitSettings } from "./job.interfaces";
import { JobRunWithFrequencyTool } from "./tools/job-run-frequency.tool";
import { JobRunOnceTool } from './tools/job-run-once.tool';
import { JobRunPeriodTool } from './tools/job-run-period.tool';
const moment = require('moment-timezone');

export class JobService {

  constructor(
    private settings: JobToolkitSettings
  ) { }

  async create(job: Partial<IJob>) {
    console.log('Creating job', { job });

    job.aiEmployee = this.settings.aiEmployee?._id;
    job.createdBy = this.settings.user?._id;
    job.updatedBy = this.settings.user?._id;

    await this.schedulerRun(job);

    // Create Job
    return await new RepositoryHelper(Job, this.settings.user?._id).create(job) as IJob;
  }

  async schedulerRun(job: Partial<IJob>) {
    try {
      job._id = job._id || new ObjectId().toHexString();
      const scheduleName = `job-execute-${job._id}`;

      if (scheduleName) {
        try {
          await new SchedulerService().deleteJob(scheduleName);
        } catch (error) { }
      }

      // Scheduler
      job.scheduler = {
        name: scheduleName,
        timeZone: this.settings.user?.timezone || 'America/Sao_Paulo',
        httpTarget: {
          httpMethod: 'POST',
          uri: `${process.env.SERVER_URL}/jobs/${job._id}/execute`,
        },
        ...job.scheduler || {},
      };

      if (job.scheduler.frequency) {
        const result = await CronService.fromText(job.scheduler.frequency);
        job.scheduler.runOnce = result.runOnce;
        job.scheduler.schedule = result.formattedCron;
        job.scheduler.frequency = result.formattedInput;
        if (result.date) {
          try { job.scheduler.startAt = moment(result.date.replace('Z', '')).clone().tz(this.settings.user.timezone, true).toDate(); } catch { }
        }
      } else {
        delete job.scheduler.schedule;
      }

      if (job.status === 'running') {
        await new SchedulerService().createJob(job.scheduler);
      }

    } catch (error) {
      console.error('JobService.schedulerRun: ', error);
    }
  }

  async execute(job: IJob, force = false) {
    if (!force) {
      // Check status
      if (job.status === 'stopped') {
        await JobService.schedulerStop(job);
        throw new Error('Job are stopped');
      }

      // Check startAt
      if (job.scheduler.startAt && new Date(job.scheduler.startAt) > new Date()) {
        throw new Error('Job are not started');
      }

      // Check endAt
      if (job.scheduler.endAt && new Date(job.scheduler.endAt) < new Date()) {
        await JobService.schedulerStop(job);
        throw new Error('Job are ended');
      }
    }

    // Execute
    // console.log('Executing job', { id: job._id.toString(), name: job.name, instructions: job.instructions });
    console.log('Executing job', { job });
    const call = await this.settings.aiEmployee.call({
      input: job.instructions,
      user: this.settings.user,
      context: {
        chatChannel: 'email',
        job: {
          _id: job._id.toString(),
          name: job.name,
          instructions: job.instructions,
          context: job.context,
          status: job.status,
          scheduler: {
            name: job.scheduler?.name,
            frequency: job.scheduler.frequency,
            schedule: job.scheduler?.schedule,
            timeZone: job.scheduler?.timeZone,
          },
        }
      },
    });

    // Run
    const callResult: IAIEmployeeCall = await new Promise((resolve, reject) => {
      try {
        call.run().subscribe(call => {
          if (call.status === 'done') {
            resolve(call);
          }
        });
      } catch (error) {
        reject(error);
      }
    });

    // Run once
    if (job.scheduler?.runOnce) {
      console.log('Job run once', { id: job._id.toString(), name: job.name });
      await JobService.schedulerStop(job);
    }
    return callResult;
  }

  static async schedulerStop(job: Partial<IJob>) {
    try {
      await Job.updateOne({ _id: job._id }, { status: 'stopped' }).exec();
      await new SchedulerService().deleteJob(job.scheduler.name);
    } catch (error) {
      console.log('JobService.schedulerStop: ', error.message);

    }
  }

  toolkit(): DynamicStructuredTool[] | Tool[] {
    return [
      new JobRunWithFrequencyTool(this.settings),
      new JobRunOnceTool(this.settings),
      new JobRunPeriodTool(this.settings),
    ];
  }
}
