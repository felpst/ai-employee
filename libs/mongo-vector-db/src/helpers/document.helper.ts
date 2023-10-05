import { Document as LangChainDoc } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document as MongoDoc } from 'mongodb';

export async function splitDocuments<T extends MongoDoc>(
  docsToSplit: T[]
): Promise<LangChainDoc[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const documents = docsToSplit.map(
    (doc) =>
      new LangChainDoc({
        pageContent: doc.data,
        metadata: {
          documentId: doc._id,
          workspace: doc.workspace,
          updatedAt: doc.updatedAt,
        },
      })
  );

  return splitter.splitDocuments(documents);
}
