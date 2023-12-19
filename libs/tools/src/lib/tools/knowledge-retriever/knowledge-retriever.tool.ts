import { Knowledge } from '@cognum/models';
import { KnowledgeRetrieverService } from '@cognum/tools';
import { DynamicTool } from 'langchain/tools';
import { KnowledgeRetrieverToolSettings } from './knowledge-retriever.interfaces';

export class KnowledgeRetrieverTool extends DynamicTool {
  constructor(settings: KnowledgeRetrieverToolSettings) {
    super({
      name: 'Knowledge Retriever',
      metadata: { id: "knowledge-retriever" },
      description: 'Get informations from the knowledge added to the assistant. Input must be a question.',
      func: async (input: string) => {
        try {
          console.log('Knowledge Retriever', { input, settings });

          const knowledges = await Knowledge
            .find({ workspace: settings.workspaceId })
            .select('openaiFileId')
            .lean();
          const fileIds = knowledges.map(({ openaiFileId }) => openaiFileId);

          return await new KnowledgeRetrieverService()
            .askToAssistant(input, fileIds);
        } catch (error) {
          console.error(error);
          return error.message;
        }
      }
    });
  }

}
