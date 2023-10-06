import MongoVectorDatabase from '@cognum/mongo-vector-db';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { DynamicTool } from 'langchain/tools';

export class KnowledgeBaseTool extends DynamicTool {
  constructor() {
    const vectorDb = new MongoVectorDatabase('nomeprovisorio');

    super({
      name: 'Knowledge Base',
      description:
        'Use this when you need search informations you dont know and possible to find in knowledge base of company. Input should be a question.',
      func: async (input: string) => {
        /**
         * Cria retriever do banco vetorial mongo
         * Consulta documentos
         */

        const retrieverAttributeInfo: AttributeInfo[] = [
          {
            name: 'data',
            description: 'Data of knowledge',
            type: 'string',
          },
        ];

        const selfQueryRetriever = vectorDb.getRetriever(
          retrieverAttributeInfo,
          'company data'
        );

        const relevantDocs = await selfQueryRetriever.getRelevantDocuments(
          input
        );

        console.log(relevantDocs);

        return relevantDocs.map((doc) => doc.pageContent).join('\n');
      },
    });
  }
}
