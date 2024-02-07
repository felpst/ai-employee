import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { JobToolkitSettings } from '../job.interfaces';
import { JobService } from '../job.service';
const moment = require('moment-timezone');

export class JobRunOnceTool extends DynamicStructuredTool {

  constructor(settings: JobToolkitSettings) {
    super({
      name: 'Schedule Task to Run Once',
      description: 'Use to create schedule tasks to be execute once time on the future, It is common when a message has a specific date or time to execute, or tomorrow, the end of the day, etc. Avoid use this tool to create same task with same frequency in a row, this can cause loops.',
      metadata: { id: "job", tool: "runOnce" },
      schema: z.object({
        name: z.string().describe('name of job or task to execute.'),
        instructions: z.string().describe('instructions to execute the job or task, break down the instructions into a detailed step-by-step guide with all the details necessary for that task to be performed and without frequency, always aligned with your capabilities. Avoid placing instructions for scheduling tasks or frequecy in tasks to avoid loops. Remove all instructions of date or time execution, frequency or schedule. If you need send a message to user, use a chat channel context to send message to user.'),
        context: z.object({
          user: z.object({
            _id: z.string().describe('_id of user.'),
            name: z.string().describe('name of user.'),
            email: z.string().describe('mail of user.'),
          }),
          chatChannel: z.string().optional().describe('chat channel if need send message to user.'),
        }),
        scheduler: z.object({
          startAt: z.string().describe('date to execute task.'),
        })
      }),
      func: async ({ name, instructions, context, scheduler }) => {
        try {
          scheduler.runOnce = true;
          scheduler.startAt = moment(scheduler.startAt.replace('Z', '')).clone().tz(settings.user.timezone, true).toDate();
          scheduler.frequency = scheduler.startAt;

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
