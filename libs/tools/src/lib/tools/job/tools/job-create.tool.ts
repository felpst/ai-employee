import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { JobToolkitSettings } from '../job.interfaces';
import { JobService } from '../job.service';

export class JobCreateTool extends DynamicStructuredTool {

  constructor(settings: JobToolkitSettings) {
    super({
      name: 'Create Job',
      description: 'Use to create a new job or schedule tasks.',
      schema: z.object({
        name: z.string().describe('name of job or task to execute.'),
        frequency: z.string().describe('frequency to execute the job or task (examples: every 5 minutes, every 1 hour, every day at 7pm).'),
        instructions: z.string().describe('instructions to execute the job or task, break down the instructions into a detailed step-by-step guide with all the details necessary for that task to be performed, always aligned with your capabilities.'),
        context: z.object({
          user: z.object({
            _id: z.string().describe('id of user.').optional(),
            name: z.string().describe('name of user.').optional(),
            email: z.string().describe('mail of user.').optional(),
          }).optional(),
        }).optional(),
      }),
      metadata: { id: "job", tool: "create" },
      func: async ({ name, frequency, instructions, context }) => {
        try {
          console.log('Creating job...', { name, frequency, instructions, context });

          const jobService = new JobService(settings);
          const job = await jobService.create({
            name,
            frequency,
            instructions,
            context
          })
          return 'Job create successfully: ```json\n' + JSON.stringify(job, null, 2) + '\n```';
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
