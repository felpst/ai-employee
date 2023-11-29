import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { LinkedInLeadScraperToolSettings } from './linkedin-lead-scraper.interfaces';
import { LinkedinScraperService } from './linkedin-lead-scraper.service';

export class LinkedInLeadScraperTool extends DynamicStructuredTool {
  constructor(settings: LinkedInLeadScraperToolSettings) {
    super({
      name: 'LinkedIn Lead Scraper',
      metadata: {
        id: 'linkedin-lead-scraper',
      },
      description:
        'Scrapes linkedin for data.',
      schema: z.object({
        profession: z.string().describe('profession to be searched.'),
        quantity: z.number().default(5).describe('quantity of data to be scraped.'),
      }),
      func: async ({ profession, quantity }) => {
        try {
          const linkedinScraperService = new LinkedinScraperService(settings.username, settings.password);
          return await linkedinScraperService.forProfession(profession, quantity)
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
