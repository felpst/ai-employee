import { Pinecone } from '@pinecone-database/pinecone';
import { VectorDBQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

export default class KnowledgeBase {
  private pineconeIndex;
  private llm: OpenAI;
  private vectorStore: PineconeStore;

  constructor(private indexName: string) {
    this.llm = new OpenAI();
    const embeddings = new OpenAIEmbeddings();

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: 'gcp-starter',
    });
    this.pineconeIndex = pinecone.Index(this.indexName);

    this.vectorStore = new PineconeStore(embeddings, {
      pineconeIndex: this.pineconeIndex,
    });
  }

  async indexDocuments(docs: Document[]) {
    return this.vectorStore.addDocuments(docs);
  }

  async query(input: string, documentsCount = 3) {
    const chain = VectorDBQAChain.fromLLM(this.llm, this.vectorStore, {
      k: documentsCount,
      returnSourceDocuments: true,
    });

    return chain.call({ query: input });
  }

  async deleteDocumentsByOwnerDocumentId(ownerDocumentId: string) {
    return this.pineconeIndex.deleteMany({ ownerDocumentId });
  }
}
