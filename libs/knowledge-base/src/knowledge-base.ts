import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { VectorDBQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

interface QueryOutput {
  text: string;
  sourceDocuments: Document[];
}

export default class KnowledgeBase {
  private pineconeIndex: Index<RecordMetadata>;
  private llm: OpenAI;
  private vectorStore: PineconeStore;
  private pinecone: Pinecone;

  constructor(private indexName: string) {
    this.llm = new OpenAI();
    const embeddings = new OpenAIEmbeddings();

    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: 'gcp-starter',
    });
    this.pineconeIndex = this.pinecone.Index(this.indexName);

    this.vectorStore = new PineconeStore(embeddings, {
      pineconeIndex: this.pineconeIndex,
    });
  }

  async indexDocuments(docs: Document[]): Promise<string[]> {
    await this.createIndexIfNotExists();
    return this.vectorStore.addDocuments(docs);
  }

  async query(input: string, documentsCount = 3): Promise<QueryOutput> {
    const chain = VectorDBQAChain.fromLLM(this.llm, this.vectorStore, {
      k: documentsCount,
      returnSourceDocuments: true,
    });

    return chain.call({ query: input }) as Promise<QueryOutput>;
  }

  async deleteDocumentsByOwnerDocumentId(
    ownerDocumentId: string
  ): Promise<void> {
    return this.pineconeIndex.deleteMany({ ownerDocumentId });
  }

  async createIndexIfNotExists() {
    const doesIndexExist = await this._verifyIndex(true); // throws error if different from "index not found"
    if (!doesIndexExist) {
      await this.pinecone.createIndex({
        name: this.indexName,
        dimension: 1536,
        metric: 'cosine',
      });

      await this._watchUntilIndexIsReady();
    }
  }

  private async _verifyIndex(throwIfExceptionDiffFromNotFound = false) {
    return this.pineconeIndex
      .describeIndexStats()
      .then(() => true)
      .catch((error) => {
        if (
          throwIfExceptionDiffFromNotFound &&
          error.name !== 'PineconeNotFoundError'
        )
          throw error;
        else return false;
      });
  }

  private async _watchUntilIndexIsReady(timeout = 15, verifyWindow = 3) {
    let isIndexReady = await this._verifyIndex();

    while (!isIndexReady && timeout) {
      [isIndexReady] = await Promise.all([
        this._verifyIndex(),
        new Promise((r) => setTimeout(r, verifyWindow * 1000)),
      ]);

      if (timeout >= verifyWindow) timeout -= verifyWindow;
      else timeout = 0;
    }

    if (!timeout && !isIndexReady)
      throw new Error('Pinecode index took too long to be created.');
    return true;
  }
}
