import { OpenAI } from '@cognum/llm/openai';
import { LLMChain } from 'langchain/chains';
import { Document as LangChainDoc } from 'langchain/document';
import { ChatPromptTemplate } from 'langchain/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document as MongoDoc } from 'mongodb';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface KnowledgeDocument extends Omit<LangChainDoc, 'metadata'> {
  metadata: KnowledgeMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface KnowledgeMetadata extends Record<string, any> {
  ownerDocumentId: string;
  updatedAt: string;
}

/**
 * Split an array of mongo documents to Knowledge Base
 * @param docsToSplit Mongo documents to be splitted
 * @param options Split options
 * @returns Plain array of splitted knowledge documents with metadata
 */
export async function splitDocuments<T extends MongoDoc>(
  docsToSplit: T[],
  chunkSize?: number
): Promise<KnowledgeDocument[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize || 512,
    chunkOverlap: 0,
    separators: ['.', '\n'],
    keepSeparator: true,
  });

  const langChainDocsInfo: { title: string; data: LangChainDoc }[] = [];
  for (const doc of docsToSplit) {
    const data = new LangChainDoc(<KnowledgeDocument>{
      pageContent: doc.data,
      metadata: {
        ownerDocumentId: doc._id?.toString(),
        updatedAt: doc.updatedAt?.toISOString(),
      },
    });
    const title = await generateDocumentTitle(data.pageContent);

    langChainDocsInfo.push({ title, data });
  }

  return Promise.all(
    langChainDocsInfo.map(({ data, title }) =>
      splitter.splitDocuments([data], { chunkHeader: title })
    )
  ).then((result) => result.flat() as KnowledgeDocument[]);
}

async function generateDocumentTitle(text: string): Promise<string> {
  const llm = new OpenAI({ temperature: 0 });

  const systemTemplate =
    'You must provide a name for a document inserted by the human. Use this prompt: "DOCUMENT NAME: [document name]".';

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemTemplate],
    ['human', text],
  ]);

  const chain = new LLMChain({ llm, prompt: chatPrompt });
  const title = (await chain.run({})).trim() + '\n\n---\n\n';

  return title;
}
