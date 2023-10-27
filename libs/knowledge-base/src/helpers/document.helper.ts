import { Document as LangChainDoc } from 'langchain/document';
import { Document as MongoDoc } from 'mongodb';
import ContextualTextSplitter from '../splitters/contextual-splitter';

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
  const splitter = new ContextualTextSplitter({
    chunkSize: chunkSize || 512,
    chunkOverlap: 0,
    separators: ['\n', '.'],
    keepSeparator: true,
  });

  const langChainDocs: LangChainDoc[] = [];
  for (const doc of docsToSplit) {
    const data = new LangChainDoc(<KnowledgeDocument>{
      pageContent: doc.data,
      metadata: {
        ownerDocumentId: doc._id?.toString(),
        updatedAt: doc.updatedAt?.toISOString(),
      },
    });

    langChainDocs.push(data);
  }

  return splitter.splitBySection(langChainDocs) as Promise<KnowledgeDocument[]>
}
