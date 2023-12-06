import { DynamicTool } from 'langchain/tools';
import OpenAI from 'openai';
import { KnowledgeRetrieverToolSettings } from './knowledge-retriever.interfaces';
import { KnowledgeRetrieverService } from './knowledge-retriever.service';

export class KnowledgeRetrieverTool extends DynamicTool {
  constructor(settings: KnowledgeRetrieverToolSettings) {
    const openai = new OpenAI();

    super({
      name: 'Knowledge Retriever',
      metadata: { id: "knowledge-retriever" },
      description: 'Get informations from the knowledge added to the assistant. Input must be a question.',
      func: async (input: string) => {
        try {
          console.log('Knowledge Retriever', { input, settings });
          return await new KnowledgeRetrieverService(settings).question(input)
        } catch (error) {
          console.error(error);
          return error.message;
        }
      }
    });
  }

}
