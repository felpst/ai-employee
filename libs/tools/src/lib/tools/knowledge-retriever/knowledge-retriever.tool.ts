import { KnowledgeRetrieverService } from '@cognum/tools';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { KnowledgeRetrieverToolSettings } from './knowledge-retriever.interfaces';
import { z } from 'zod';

export class KnowledgeRetrieverTool extends DynamicStructuredTool {
  constructor(settings: KnowledgeRetrieverToolSettings) {
    super({
      name: 'Knowledge Retriever',
      metadata: { id: "knowledge-retriever" },
      description: 'Use this when you need to access all your knowledge base to find the answer to a question.',
      schema: z.object({
        question: z.string().describe('the question you need answered.')
      }),
      func: async ({ question }) => {
        try {
          console.log('Knowledge Retriever', { question, settings });
          const response = await new KnowledgeRetrieverService()
            .askToAssistant(question, settings.openaiFileIds);
          console.log('Knowledge Retriever response', response);
          return response;
        } catch (error) {
          console.error(error);
          return error.message;
        }
      }
    });
  }

}
