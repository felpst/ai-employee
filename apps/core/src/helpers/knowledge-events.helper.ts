import { IKnowledge } from '@cognum/interfaces';
import { EventEmitter } from 'events';
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoDBAtlasVectorSearch } from 'langchain/vectorstores/mongodb_atlas';
import { MongoClient, ObjectId } from 'mongodb';

const knowledgeOperationEventEmitter = new EventEmitter();

const mongoCollection = new MongoClient(process.env.MONGO_URL).db('test').collection('nomeprovisorio')
const mongoWithEmbeddings = new MongoDBAtlasVectorSearch(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY, stripNewLines: false }),
  {
    collection: mongoCollection,
    textKey: 'data'
  }
)

knowledgeOperationEventEmitter.on('create', async (docs: IKnowledge[]) => {
  const splitted = await splitDocuments(docs)
  await saveDocumentParts(splitted)
});

knowledgeOperationEventEmitter.on('update', async (doc: IKnowledge) => {
  await deleteDocumentParts(doc._id)
  const splitted = await splitDocuments([doc])
  await saveDocumentParts(splitted)
});

knowledgeOperationEventEmitter.on('delete', async (doc: IKnowledge) => {
  await deleteDocumentParts(doc._id)
});


async function splitDocuments(knowledgeDocs: IKnowledge[]): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const documents = knowledgeDocs.map(doc => 
    new Document({ 
      pageContent: doc.data,
      metadata: {
        workspace: doc.workspace,
        documentId: doc._id,
        updatedAt: doc.updatedAt
      }
    }))
  
  return splitter.splitDocuments(documents);
}

async function saveDocumentParts(docs: Document[]) {
  await mongoWithEmbeddings.addDocuments(docs)
}

async function deleteDocumentParts(ownerDocumentId: ObjectId) {
  await mongoCollection.deleteMany({ documentId: ownerDocumentId })
}

export default knowledgeOperationEventEmitter