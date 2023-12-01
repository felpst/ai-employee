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
        'Use this to extract leads form LinkedIn. Input should be a structured query search for LinkedIn.',
      schema: z.object({
        query: z.string().describe('a structured query search for LinkedIn.'),
        quantity: z.number().default(5).describe('quantity of leads to be scraped/extracted.'),
      }),
      func: async ({ query, quantity }) => {
        try {
          const linkedinDriver = new LinkedInWebDriver();
          await linkedinDriver.login(settings);
          const leads = await linkedinDriver.extractLeads(query, quantity);
          const json = JSON.stringify(leads);
          await linkedinDriver.driver.quit();
          return "Leads list: \n```json\n" + json + "\n```";
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
