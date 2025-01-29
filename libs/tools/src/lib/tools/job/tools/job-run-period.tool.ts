import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { JobToolkitSettings } from '../job.interfaces';
import { JobService } from '../job.service';
const moment = require('moment-timezone');

export class JobRunPeriodTool extends DynamicStructuredTool {

  constructor(settings: JobToolkitSettings) {
    super({
      name: 'Schedule Task to Run in Period',
      description: 'Use to create schedule tasks with frequency of execution during a given period, It is common when a message has every X until Y... examples: every day, every month, with at specific time, every wednesday, every monday, every morning, until date, until next week, until next month, etc. Avoid use this tool to create same task with same frequency in a row, this can cause loops.',
      metadata: { id: "job", tool: "runPeriod" },
      schema: z.object({
        name: z.string().describe('name of job or task to execute.'),
        instructions: z.string().describe('instructions to execute the job or task, break down the instructions into a detailed step-by-step guide with all the details necessary for that task to be performed and without frequency, always aligned with your capabilities. Avoid placing instructions for scheduling tasks or frequency in tasks to avoid loops. Remove all instructions of date or time execution, frequency or schedule.'),
        context: z.object({
          user: z.object({
            _id: z.string().describe('_id of user.').optional(),
            name: z.string().describe('name of user.').optional(),
            email: z.string().describe('mail of user.').optional(),
          }).optional(),
        }).optional(),
        scheduler: z.object({
          frequency: z.string().describe('frequency to execute the job or task (examples: every 5 minutes, every 1 hour, every day at 7pm).'),
          startAt: z.string().describe('date to start execute job or task.'),
          endAt: z.string().describe('date to stop execute job or task.'),
        })
      }),
      func: async ({ name, instructions, context, scheduler }) => {
        try {
          scheduler.runOnce = false;
          scheduler.startAt = moment(scheduler.startAt.replace('Z', '')).clone().tz(settings.user.timezone, true).toDate();
          scheduler.endAt = moment(scheduler.endAt.replace('Z', '')).clone().tz(settings.user.timezone, true).toDate();

          const jobService = new JobService(settings);
          const job = await jobService.create({
            name,
            instructions,
            context,
            scheduler,
            status: 'running'
          });
          return 'Job create successfully: ```json\n' + JSON.stringify(job, null, 2) + '\n```';
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
