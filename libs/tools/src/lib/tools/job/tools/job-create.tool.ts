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
        instructions: z.string().describe('instructions to execute the job or task.'),
      }),
      metadata: { id: "job", tool: "create" },
      func: async ({ name, frequency, instructions }) => {
        try {
          const jobService = new JobService(settings);
          const job = await jobService.create({
            name,
            frequency,
            instructions,
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
