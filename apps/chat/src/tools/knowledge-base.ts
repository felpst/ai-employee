import { OpenAI, OpenAIEmbeddings } from '@cognum/llm/openai';
import { Knowledge } from '@cognum/models';
import { Document } from 'langchain/document';
import { SelfQueryRetriever } from 'langchain/retrievers/self_query';
import { ChromaTranslator } from 'langchain/retrievers/self_query/chroma';
import { DynamicTool } from 'langchain/tools';
import { FaissStore } from 'langchain/vectorstores/faiss';

export class KnowledgeBaseTool extends DynamicTool {
  constructor() {
    super({
      name: 'Knowledge Base',
      description:
        'Use this when you need search informations you dont know and possible to find in knowledge base of company. Input should be a question.',
      func: async (input: string) => {
        /**
         * Carregar todos os documentos do knowledgeBase
         * embeddings
         * Cria banco vetorial
         * Consultar
         */

        const knowledgeBase = await Knowledge.find();

        const docs: Document[] = knowledgeBase.map((item) => {
          return new Document({
            pageContent: item.data,
          });
        });

        const vectorStore = await FaissStore.fromDocuments(
          docs,
          new OpenAIEmbeddings()
        );

        // retrievers
        const llm = new OpenAI();
        const selfQueryRetriever = SelfQueryRetriever.fromLLM({
          llm,
          vectorStore,
          documentContents: 'company data',
          attributeInfo: [
            {
              name: 'data',
              description: 'Data of knowledge',
              type: 'string',
            },
          ],
          structuredQueryTranslator: new ChromaTranslator(),
        });

        const relevantDocs = await selfQueryRetriever.getRelevantDocuments(
          input,
          {}
        );
        console.log(relevantDocs);

        return relevantDocs.map((doc) => doc.pageContent).join('\n');
      },
    });
  }
}
