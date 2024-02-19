import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { LinkedInService } from '../linkedin.service';
import { ILinkedInToolSettings } from './linkedin-tools.interfaces';

export class LinkedInFindLeadsTool extends DynamicStructuredTool {
  constructor(settings: ILinkedInToolSettings) {
    super({
      name: 'LinkedIn Find Leads',
      metadata: { id: 'linkedin', tool: 'findLeads' },
      description:
        'Use this to find and extract leads form LinkedIn.',
      schema: z.object({
        query: z.string().describe('a structured query search for LinkedIn.'),
        quantity: z.number().default(5).describe('quantity of leads to be scraped/extracted.'),
      }),
      func: async ({ query, quantity }) => {
        try {
          const linkedInService = new LinkedInService();
          await linkedInService.start();
          await linkedInService.login(settings.auth);
          const leads = await linkedInService.findLeads({ query, quantity });
          await linkedInService.stop();

          const json = JSON.stringify(leads, null, 2);
          return "Leads list: \n```json\n" + json + "\n```";
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
