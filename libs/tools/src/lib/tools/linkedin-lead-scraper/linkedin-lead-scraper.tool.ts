import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { LinkedInWebDriver } from './drivers/linkedin.driver';
import { LinkedInLeadScraperToolSettings } from './linkedin-lead-scraper.interfaces';

export class LinkedInLeadScraperTool extends DynamicStructuredTool {
  constructor(settings: LinkedInLeadScraperToolSettings) {
    super({
      name: 'LinkedIn Lead Scraper',
      metadata: {
        id: 'linkedin-lead-scraper',
      },
      description:
        'Use this to extract leads form Linkedin. Input should be query search for linkedin.',
      schema: z.object({
        query: z.string().describe('query to be searched.'),
        quantity: z.number().default(5).describe('quantity of data to be scraped.'),
      }),
      func: async ({ query, quantity }) => {
        try {
          const linkedinDriver = new LinkedInWebDriver();
          await linkedinDriver.login(settings);
          const leads = await linkedinDriver.extractLeads(query, quantity);
          const json = JSON.stringify(leads);
          return "Leads list: \n```json\n" + json + "\n```";
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
