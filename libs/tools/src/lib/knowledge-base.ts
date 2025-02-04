import KnowledgeBase from '@cognum/knowledge-base';
import { DynamicTool } from '@langchain/core/tools';

export class KnowledgeBaseTool extends DynamicTool {
  constructor(knowledgeWorkspaceId: string) {
    const knowledgeBase = new KnowledgeBase(knowledgeWorkspaceId);

    super({
      name: 'Knowledge Base',
      description:
        'Use this when you need search informations you dont know and possible to find in knowledge base of company. Input should be a question.',
      func: async (input: string) => {
        const relevantDocs = await knowledgeBase.query(input);

        console.log(relevantDocs);

        return relevantDocs.map((doc) => doc.pageContent).join('\n');
      },
    });
  }
}
