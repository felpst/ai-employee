import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { LinkedinScraperService } from './linkedin-scraper.service';


export class LinkedinScraperTool extends DynamicStructuredTool {

    constructor(username: string, password: string) {
        super({
            name: 'Linkedin Scaper',
            description:
                'Scrapes linkedin for data.',
            schema: z.object({
                profession: z.string().describe('profession to be searched.'),
                quantity: z.number().describe('quantity of data to be scraped.'),
            }),
            func: async ({ profession, quantity }) => {
                try {
                    const linkedinScraperService = new LinkedinScraperService(username, password);
                    return await linkedinScraperService.forProfession(profession, quantity)
                } catch (error) {
                    return error.message;
                }
            },
        });
    }
}
