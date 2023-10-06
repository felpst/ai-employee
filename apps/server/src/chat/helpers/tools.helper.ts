import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Tool } from 'langchain/tools';
import { FaissStore } from 'langchain/vectorstores/faiss';

export class ToolsHelper {
  private _tools: Tool[];
  private _vectorStore: FaissStore;

  constructor(tools: Tool[] = []) {
    this._tools = tools;
    this._storeTools();
  }

  get tools() {
    return this._tools;
  }

  async getTools(query: string, k = 3) {
    if (!query) return [];
    const retriever = this._vectorStore.asRetriever(k);
    const docs = await retriever.getRelevantDocuments(query);
    const tools = [];
    for (const doc of docs) {
      tools.push(this._tools[doc.metadata.index]);
    }
    return tools;
  }

  private async _storeTools() {
    const docs = this._tools.map(
      (tool, index) =>
        new Document({
          pageContent: tool.description,
          metadata: { index },
        })
    );

    this._vectorStore = await FaissStore.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
    return this._vectorStore;
  }
}
