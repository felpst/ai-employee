import { Knowledge } from '@cognum/models';
import { KnowledgeRetrieverService } from '@cognum/tools';
import { DynamicStructuredTool, DynamicTool } from 'langchain/tools';
import { KnowledgeRetrieverToolSettings } from './knowledge-retriever.interfaces';
import { z } from 'zod';

export class KnowledgeRetrieverTool extends DynamicStructuredTool {
  constructor(settings: KnowledgeRetrieverToolSettings) {
    super({
      name: 'Knowledge Retriever',
      metadata: { id: "knowledge-retriever" },
      description: 'Use this when you need to access all your knowledge base to find the answer to a question.',
      schema: z.object({
        input: z.string().describe('the question you need answered.')
      }),
      func: async (input: string) => {
        try {
          console.log('Knowledge Retriever', { input, settings });

          // const knowledges = await Knowledge
          //   .find({ workspace: settings.workspaceId })
          //   .select('openaiFileId')
          //   .lean();
          // const fileIds = knowledges.map(({ openaiFileId }) => openaiFileId);

          return await new KnowledgeRetrieverService()
            .askToAssistant(input, settings.openaiFileIds);
        } catch (error) {
          console.error(error);
          return error.message;
        }
      }
    });
  }

}
