import { Document as LangChainDoc } from 'langchain/document';
import {
  RecursiveCharacterTextSplitter,
  RecursiveCharacterTextSplitterParams,
} from 'langchain/text_splitter';
import { Document as MongoDoc } from 'mongodb';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface KnowledgeDocument extends Omit<LangChainDoc, 'metadata'> {
  metadata: KnowledgeMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface KnowledgeMetadata extends Record<string, any> {
  ownerDocumentId: string;
  workspace: string;
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
  options?: Partial<RecursiveCharacterTextSplitterParams>
): Promise<KnowledgeDocument[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
    ...(options || {}),
  });

  const documents = docsToSplit.map(
    (doc) =>
      new LangChainDoc(<KnowledgeDocument>{
        pageContent: doc.data,
        metadata: {
          ownerDocumentId: doc._id?.toString(),
          workspace: doc.workspace?.toString(),
          updatedAt: doc.updatedAt?.toISOString(),
        },
      })
  );

  return splitter.splitDocuments(documents) as Promise<KnowledgeDocument[]>;
}
