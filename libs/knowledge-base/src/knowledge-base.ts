import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { VectorDBQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { indexConfig } from './config/database-index.config';

interface QueryOutput {
  text: string;
  sourceDocuments: Document[];
}

export default class KnowledgeBase {
  private _pineconeIndex: Index<RecordMetadata>;
  private _llm: OpenAI;
  private _vectorStore: PineconeStore;
  private _pinecone: Pinecone;

  constructor(private indexName: string) {
    this._llm = new OpenAI();
    const embeddings = new OpenAIEmbeddings();

    this._pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: 'gcp-starter',
    });
    this._pineconeIndex = this._pinecone.Index(this.indexName);

    this._vectorStore = new PineconeStore(embeddings, {
      pineconeIndex: this._pineconeIndex,
    });
  }

  async indexDocuments(docs: Document[]): Promise<string[]> {
    return this._vectorStore.addDocuments(docs);
  }

  async query(input: string, documentsCount = 3): Promise<QueryOutput> {
    const chain = VectorDBQAChain.fromLLM(this._llm, this._vectorStore, {
      k: documentsCount,
      returnSourceDocuments: true,
    });

    return chain.call({ query: input }) as Promise<QueryOutput>;
  }

  async deleteDocumentsByOwnerDocumentId(
    ownerDocumentId: string
  ): Promise<void> {
    return this._pineconeIndex.deleteMany({ ownerDocumentId });
  }

  async createIndex() {
    return this._pinecone.createIndex({
      name: this.indexName,
      ...indexConfig,
    });
  }

  async deleteIndex() {
    return this._pinecone.deleteIndex(this.indexName);
  }
}
