import { IKnowledge } from '@cognum/interfaces';
import KnowledgeBase, { splitDocuments } from '@cognum/knowledge-base';
import { EventEmitter } from 'events';

const knowledgeOperationEventEmitter = new EventEmitter();

knowledgeOperationEventEmitter.on('create', async (docs: IKnowledge[]) => {
  if (!docs) return;
  const vectorDb = new KnowledgeBase(docs[0].workspace.toString());
  const splitted = await splitDocuments(docs);
  await vectorDb.indexDocuments(splitted);
});

knowledgeOperationEventEmitter.on('update', async (doc: IKnowledge) => {
  if (!doc) return;
  const vectorDb = new KnowledgeBase(doc.workspace.toString());
  await vectorDb.deleteDocumentsByOwnerDocumentId(doc._id.toString());
  const splitted = await splitDocuments([doc]);
  await vectorDb.indexDocuments(splitted);
});

knowledgeOperationEventEmitter.on('delete', async (doc: IKnowledge) => {
  if (!doc) return;
  const vectorDb = new KnowledgeBase(doc.workspace.toString());
  await vectorDb.deleteDocumentsByOwnerDocumentId(doc._id.toString());
});

export default knowledgeOperationEventEmitter;
