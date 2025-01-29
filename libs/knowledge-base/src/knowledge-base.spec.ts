import { KnowledgeDocument } from './helpers';
import KnowledgeBase from './knowledge-base';

describe('Mongo Vector DB tests', () => {
  let dbInstance: KnowledgeBase;
  beforeAll(async () => {
    dbInstance = new KnowledgeBase('test');
    await dbInstance.setupCollection();
  });

  it('should add a document to the database', async () => {
    const knowledge: KnowledgeDocument = {
      pageContent:
        'A cognum é uma startup de tecnologia voltada para inteligência artificial',
      metadata: {
        ownerDocumentId: '651d8dd7cb0c5ff6320c8461',
        updatedAt: new Date().toISOString(),
        loc: {
          lines: {
            from: 0,
            to: 0,
          },
        },
      },
    };
    const [resposeType, responseValue] = await new Promise<unknown[]>(
      (resolve) => {
        dbInstance
          .addDocuments([knowledge])
          .then((result) => resolve(['success', result]))
          .catch((error) => resolve(['error', error]));
      }
    );

    expect(resposeType).toBe('success');
    expect(responseValue).toBeUndefined();
  });

  it('should retrieve documents from database', async () => {
    const res = await dbInstance.query('O que é a cognum?');

    console.log({ res });

    expect(res).not.toBe(null);
    expect(res[0].pageContent).not.toBe(null);
    expect(res[0].pageContent).toBe(
      'A cognum é uma startup de tecnologia voltada para inteligência artificial'
    );
    expect(res.length).toBeGreaterThan(0);
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
    expect(responseValue).toBeUndefined();
  });
});
