import { OpenAI } from 'langchain';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SelfQueryRetriever } from 'langchain/retrievers/self_query';
import { ChromaTranslator } from 'langchain/retrievers/self_query/chroma';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { MongoDBAtlasVectorSearch } from 'langchain/vectorstores/mongodb_atlas';
import { Collection, MongoClient, ObjectId } from 'mongodb';

export default class MongoVectorDatabase extends MongoDBAtlasVectorSearch {
  dataCollection: Collection;
  vectorDbInstance: MongoDBAtlasVectorSearch;

  constructor(collectionName: string) {
    const collection = new MongoClient(process.env.MONGO_URL)
      .db(process.env.ENV)
      .collection(collectionName);

    super(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        stripNewLines: false,
      }),
      {
        collection,
        textKey: 'data',
      }
    );

    this.dataCollection = collection;
  }

  getRetriever(attributeInfo: AttributeInfo[], documentContents: string) {
    const llm = new OpenAI();
    const selfQueryRetriever = SelfQueryRetriever.fromLLM({
      llm,
      vectorStore: this,
      documentContents,
      attributeInfo,
      structuredQueryTranslator: new ChromaTranslator(),
    });
    return selfQueryRetriever;
  }

  async deleteDocumentsByOwnerDocumentId(ownerDocumentId: ObjectId) {
    await this.dataCollection.deleteMany({ documentId: ownerDocumentId });
  }
}
