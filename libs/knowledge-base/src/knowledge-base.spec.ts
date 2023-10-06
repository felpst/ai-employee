import { KnowledgeDocument } from './helpers';
import KnowledgeBase from './knowledge-base';

describe('Mongo Vector DB tests', () => {
  let dbInstance: KnowledgeBase;
  beforeAll(async () => {
    dbInstance = new KnowledgeBase('test');
  });

  it('should add a document to the database', async () => {
    const knowledge: KnowledgeDocument = {
      pageContent:
        'A cognum é uma startup de tecnologia voltada para inteligência artificial',
      metadata: {
        ownerDocumentId: '651d8dd7cb0c5ff6320c8461',
        workspace: '121d8dd7cb0c5ff6320c8442',
        updatedAt: new Date().toISOString(),
      },
    };
    const [docId] = await dbInstance.indexDocuments([knowledge]);

    expect(docId).not.toBeNull();
    expect(typeof docId).toBe('string');
  });

  it('should add documents to the database', async () => {
    const res = await dbInstance.query('O que é a cognum?');

    expect(res).not.toBe(null);
    expect(res.text).not.toBe(null);
    expect(res.text).toContain(
      'A Cognum é uma startup de tecnologia voltada para inteligência artificial.'
    );
    expect(res.sourceDocuments.length).toBeGreaterThan(0);
  });

  it('should delete documents from database', async () => {
    const [resposeType, responseValue] = await new Promise<unknown[]>(
      (resolve) => {
        dbInstance
          .deleteDocumentsByOwnerDocumentId('651d8dd7cb0c5ff6320c8461')
          .then((result) => resolve(['success', result]))
          .catch((error) => resolve(['error', error]));
      }
    );

    expect(resposeType).toBe('success');
    expect(responseValue).toBe(undefined);
  });
});
