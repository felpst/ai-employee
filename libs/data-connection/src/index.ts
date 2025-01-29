import { IDataSource } from '@cognum/interfaces';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

export class DataConnection {
  dataSources: IDataSource[] = [];

  /**
   * ETL Data Source
   * Extract: extract data from data source
   * Transform: transform data to a common format
   * Load: load data to a data store
   * @param dataSource
   */
  async ETL(dataSource: IDataSource) {
    try {
      // Extract
      const docs = await this._extract[dataSource.type](dataSource);
      console.log(docs);

      // Transform

      // Load
    } catch (error) {
      console.error('Error ETL data source', error);
    }
  }
  private get _extract() {
    return {
      file: async (dataSource: IDataSource): Promise<Document<any>[]> => {
        if (dataSource.metadata.mimeType === 'application/pdf') {
          const loader = new PDFLoader(dataSource.metadata.filePath);
          const docs = await loader.load();
          return docs;
        }
        return [];
      },
    };
  }
}
