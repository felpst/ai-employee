import { IKnowledge } from '@cognum/interfaces';
import MongoVectorDatabase, { splitDocuments } from '@cognum/mongo-vector-db';
import { EventEmitter } from 'events';

const knowledgeOperationEventEmitter = new EventEmitter();
const vectorDb = new MongoVectorDatabase('nomeprovisorio');

knowledgeOperationEventEmitter.on('create', async (docs: IKnowledge[]) => {
  if (!docs) return;
  const splitted = await splitDocuments(docs);
  await vectorDb.addDocuments(splitted);
});

knowledgeOperationEventEmitter.on('update', async (doc: IKnowledge) => {
  if (!doc) return;
  await vectorDb.deleteDocumentsByOwnerDocumentId(doc._id);
  const splitted = await splitDocuments([doc]);
  await vectorDb.addDocuments(splitted);
});

knowledgeOperationEventEmitter.on('delete', async (doc: IKnowledge) => {
  if (!doc) return;
  await vectorDb.deleteDocumentsByOwnerDocumentId(doc._id);
});

export default knowledgeOperationEventEmitter;
