import { Document as MongoDoc, ObjectId } from 'mongodb';
import { splitDocuments } from './document.helper';

describe('Document helper tests', () => {
  describe('splitDocuments method', () => {
    it('should split documents and append titles successfully', async () => {
      const cognumText =
        'cognum é uma startup de tecnologia voltada para inteligência artificial';
      const bookSynopsis =
        'Verdadeiro clássico moderno, concebido por um dos mais influentes escritores do século XX, A revolução dos bichos é uma fábula sobre o poder. Narra a insurreição dos animais de uma granja contra seus donos. Progressivamente, porém, a revolução degenera numa tirania ainda mais opressiva que a dos humanos.';
  
      const knowledges: MongoDoc[] = [
        {
          _id: new ObjectId('651d8dd7cb0c5ff6320c8461'),
          data: cognumText,
          updatedAt: new Date(),
        },
        {
          _id: new ObjectId('651d8dd7cb0c5ff6320c8462'),
          data: bookSynopsis,
          updatedAt: new Date(),
        },
      ];
  
      const result = await splitDocuments(knowledges, 255);
      const [cognumDocument, bookSplit1, bookSplit2] = result;
  
      expect(result.length).toBe(3);
      expect(cognumDocument.pageContent).toBe(
        'DOCUMENT NAME: Cognum_Startup_Tecnologia_Inteligência_Artificial\n\n---\n\n' +
          cognumText
      );
      expect(cognumDocument.metadata.ownerDocumentId).toBe(
        '651d8dd7cb0c5ff6320c8461'
      );
  
      expect(bookSplit1.pageContent).toBe(
        'DOCUMENT NAME: A Revolução dos Bichos\n\n---\n\n' +
          bookSynopsis.slice(0, 205)
      );
      expect(bookSplit1.metadata.ownerDocumentId).toBe(
        '651d8dd7cb0c5ff6320c8462'
      );
  
      expect(bookSplit2.pageContent).toBe(
        'DOCUMENT NAME: A Revolução dos Bichos\n\n---\n\n' +
          bookSynopsis.slice(205)
      );
      expect(bookSplit2.metadata.ownerDocumentId).toBe(
        '651d8dd7cb0c5ff6320c8462'
      );
    });
  })
});
