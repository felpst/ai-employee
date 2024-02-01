import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { InternetResearchService } from './internet-research.service';
import { SummarizationService } from "./summarization.service";
import { SearchApiToolSettings } from "./internet-research.interface";

export class InternetResearchTool extends DynamicStructuredTool {
  constructor(private settings: SearchApiToolSettings) {
    super({
      name: 'Internet Research',
      metadata: { id: 'internet-research', tool: 'search' },
      description:
        'Use this to find and summarize research form Internet.',
      schema: z.object({
        query: z.string().describe('a structured question to search.'),
      }),
      func: async ({ query }) => {
        try {
          const internetResearchService = new InternetResearchService(this.settings);
          const summarizationService = new SummarizationService();

          const result = await internetResearchService.search(query);
          if(!result) return 'No results found';

          await summarizationService.start();
          const summarized = await summarizationService.summarize(result, query);
          await summarizationService.stop();
          return summarized;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
