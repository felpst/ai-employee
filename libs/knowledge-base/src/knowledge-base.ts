import { OpenAIEmbeddings } from '@cognum/llm/openai';
import { MetricType } from '@zilliz/milvus2-sdk-node';
import { Document } from 'langchain/document';
import { Milvus } from 'langchain/vectorstores/milvus';
import { collectionConfig, milvusConfig } from './config/database-index.config';

export default class KnowledgeBase {
  private _vectorStore: Milvus;
  private _collectionName: string;

  constructor(collectionName: string) {
    this._collectionName = `_${collectionName}`;

    const embeddings = new OpenAIEmbeddings();
    this._vectorStore = new Milvus(embeddings, {
      collectionName: this._collectionName,
      ...milvusConfig,
    });
  }

  async addDocuments(docs: Document[]): Promise<void> {
    return this._vectorStore.addDocuments(docs);
  }

  async query(input: string, documentsCount = 3): Promise<Document[]> {
    return this._vectorStore.similaritySearch(input, documentsCount);
  }

  async setupCollection(): Promise<void> {
    await this._vectorStore.client.createCollection({
      collection_name: this._collectionName,
      ...collectionConfig,
    });
    await this._setupIndexes();
  }

  async deleteDocumentsByOwnerDocumentId(
    ownerDocumentId: string
  ): Promise<void> {
    await this._loadCollection();

    const { data, status } = await this._vectorStore.client.query({
      collection_name: this._collectionName,
      filter: `ownerDocumentId == "${ownerDocumentId}"`,
    });

    if (status.error_code !== 'Success') {
      await this._releaseCollection();
      throw new Error(status.reason);
    }

    const ids = data.map(({ id }) => id);
    await this._vectorStore.client.deleteEntities({
      collection_name: this._collectionName,
      expr: `id in [${ids.join()}]`,
    });

    await this._releaseCollection();
  }

  async deleteCollection(): Promise<boolean> {
    return this._vectorStore
      .ensureCollection()
      .then(async () => {
        await this._vectorStore.client.dropCollection({
          collection_name: this._collectionName,
        });
        return true;
      })
      .catch(() => false);
  }

  private async _loadCollection() {
    return this._vectorStore.client.loadCollection({
      collection_name: this._collectionName,
    });
  }

  private async _releaseCollection() {
    await this._vectorStore.client.releaseCollection({
      collection_name: this._collectionName,
    });
  }

  private async _setupIndexes(): Promise<void> {
    const { client } = this._vectorStore;

    await client.createIndex({
      collection_name: this._collectionName,
      field_name: 'id',
    });

    await client.createIndex({
      collection_name: this._collectionName,
      field_name: 'vector',
      metric_type: MetricType.L2,
    });
  }
}
