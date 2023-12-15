import { RepositoryHelper } from '@cognum/helpers';
import { IJob } from "@cognum/interfaces";
import { Job } from "@cognum/models";
import { DynamicStructuredTool, Tool } from "langchain/tools";
import { ObjectId } from "mongodb";
import { CronService } from '../cron';
import { SchedulerService } from '../scheduler/scheduler.service';
import { JobToolkitSettings } from "./job.interfaces";
import { JobCreateTool } from "./tools/job-create.tool";

export class JobService {

  constructor(
    private settings: JobToolkitSettings
  ) { }

  async create(job: Partial<IJob>) {
    job.aiEmployee = this.settings.aiEmployee?._id;
    job.createdBy = this.settings.user?._id;
    job.updatedBy = this.settings.user?._id;

    // Cron
    if (job.frequency) {
      job._id = new ObjectId().toHexString();
      job.cron = {
        name: `job-execute-${job._id}`,
        schedule: await CronService.fromText(job.frequency),
        timeZone: this.settings.user?.timezone || 'America/Sao_Paulo',
        httpTarget: {
          httpMethod: 'POST',
          uri: `${process.env.SERVER_URL}/jobs/${job._id}/execute`,
        },
      };
      await new SchedulerService().createJob(job.cron);
    }

    // Create Job
    return await new RepositoryHelper(Job, this.settings.user?._id).create(job) as IJob;
  }

  toolkit(): DynamicStructuredTool[] | Tool[] {
    return [
      new JobCreateTool(this.settings)
    ]
  }
}
