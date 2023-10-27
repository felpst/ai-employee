import { IKnowledge } from '@cognum/interfaces';
import KnowledgeBase, { KnowledgeDocument, KnowledgeMetadata } from '@cognum/knowledge-base';
import { EventEmitter } from 'events';
import { Document } from 'langchain/document';

const knowledgeOperationEventEmitter = new EventEmitter();

knowledgeOperationEventEmitter.on('create', async (docs: IKnowledge[]) => {
  if (!docs) return;
  const vectorDb = new KnowledgeBase(docs[0].workspace.toString());
  
  // const splitted = await splitDocuments(docs);
  // await vectorDb.addDocuments(splitted);
  const documents: KnowledgeDocument[] = docs.map(knowledge => {
    return new Document<KnowledgeMetadata>({
      pageContent: knowledge.data,
      metadata: {
        ownerDocumentId: knowledge._id.toString(),
        updatedAt: knowledge.updatedAt.toISOString()
      } 
    })
  })

  await vectorDb.addDocuments(documents);
});

knowledgeOperationEventEmitter.on('update', async (doc: IKnowledge) => {
  if (!doc) return;
  const vectorDb = new KnowledgeBase(doc.workspace.toString());
  await vectorDb.deleteDocumentsByOwnerDocumentId(doc._id.toString());
  
  // const splitted = await splitDocuments([doc]);
  // await vectorDb.addDocuments(splitted);
  const document = new Document<KnowledgeMetadata>({
    pageContent: doc.data,
    metadata: {
      ownerDocumentId: doc._id.toString(),
      updatedAt: doc.updatedAt.toISOString()
    } 
  })
  await vectorDb.addDocuments([document]);
});

knowledgeOperationEventEmitter.on('delete', async (doc: IKnowledge) => {
  if (!doc) return;
  const vectorDb = new KnowledgeBase(doc.workspace.toString());
  await vectorDb.deleteDocumentsByOwnerDocumentId(doc._id.toString());
});

export default knowledgeOperationEventEmitter;
