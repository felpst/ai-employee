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
    await this.createIndexIfNotExists();
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

  async createIndexIfNotExists() {
    const doesIndexExist = await this._verifyIndex(true); // throws error if different from "index not found"
    if (!doesIndexExist) {
      await this._pinecone.createIndex({
        name: this.indexName,
        dimension: 1536,
        metric: 'cosine',
      });

      await this._watchUntilIndexIsReady();
    }
  }

  private async _verifyIndex(throwIfExceptionDiffFromNotFound = false) {
    return this._pineconeIndex
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
