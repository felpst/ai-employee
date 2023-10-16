import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Milvus } from 'langchain/vectorstores/milvus';

export default class KnowledgeBase {
  private _vectorStore: Milvus;

  constructor(collectionName: string) {
    collectionName = `_${collectionName}`;
    const embeddings = new OpenAIEmbeddings();
    this._vectorStore = new Milvus(embeddings, {
      collectionName: collectionName,
    });
  }

  async indexDocuments(docs: Document[]): Promise<void> {
    return this._vectorStore.addDocuments(docs);
  }

  async query(input: string, documentsCount = 3): Promise<Document[]> {
    return this._vectorStore.similaritySearch(input, documentsCount);
  }

  async deleteDocumentsByOwnerDocumentId(
    ownerDocumentId: string
  ): Promise<void> {
    return this._vectorStore.delete({ filter: ownerDocumentId });
  }

  async createIndex() {
    return undefined;
  }

  async deleteIndex() {
    return undefined;
  }
}
