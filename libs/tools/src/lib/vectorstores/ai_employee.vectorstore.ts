import { OpenAIEmbeddings } from '@cognum/llm/openai';
import { Document } from 'langchain/document';
import { OpenAI } from 'langchain/llms/openai';
import { SelfQueryRetriever } from 'langchain/retrievers/self_query';
import { ChromaTranslator } from 'langchain/retrievers/self_query/chroma';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { FaissStore } from 'langchain/vectorstores/faiss';

export class AIEmployeeVectorStore {
  directoryPath: string;
  vectorStore: FaissStore;

  constructor(data: { directoryPath: string }) {
    this.directoryPath = `stores/${data.directoryPath}`;
  }

  async load() {
    this.vectorStore = await FaissStore.load(
      this.directoryPath,
      new OpenAIEmbeddings()
    );
  }

  async addDocuments(docs: Document[]) {
    if (!this.vectorStore) {
      this.vectorStore = await FaissStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
      );
    }
    await this.vectorStore.addDocuments(docs);
    await this.save();
  }

  async save() {
    await this.vectorStore.save(this.directoryPath);
  }

  getRetriever(attributeInfo: AttributeInfo[], documentContents: string) {
    const llm = new OpenAI();
    const selfQueryRetriever = SelfQueryRetriever.fromLLM({
      llm,
      vectorStore: this.vectorStore,
      documentContents,
      attributeInfo,
      structuredQueryTranslator: new ChromaTranslator(),
    });
    return selfQueryRetriever;
  }

  length() {
    return this.vectorStore?.docstore._docs.size || 0;
  }
}
