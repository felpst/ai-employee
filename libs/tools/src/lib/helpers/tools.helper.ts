import { EmbeddingsModel } from '@cognum/llm';
import { Document } from '@langchain/core/documents';
import { Tool } from '@langchain/core/tools';
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
    if (this._tools.length < 3) return this._tools;
    if (!query) return [];

    if (!this._vectorStore) await this._storeTools();
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
      new EmbeddingsModel()
    );
    return this._vectorStore;
  }
}
