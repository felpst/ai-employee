import { BigQuery } from '@google-cloud/bigquery';
import fs from 'fs';

interface IFromCSV {
  datasetId: string;
  tableId: string;
  csvFilePath: string;
}

export class BigQueryHelper {
  projectId: string;
  bigquery: any;

  constructor(projectId) {
    this.projectId = projectId;
    this.bigquery = new BigQuery({
      projectId: projectId,
      keyFilename: './credentials.json',
    });
  }

  async fromCSV({ csvFilePath, datasetId, tableId }: IFromCSV) {
    const [dataset] = await this.bigquery
      .dataset(datasetId)
      .get({ autoCreate: true });
    const table = dataset.table(tableId);
    const metadata = {
      sourceFormat: 'CSV',
      skipLeadingRows: 1,
      autodetect: true,
    };
    const data = fs.createReadStream(csvFilePath);
    await table.load(data, metadata);
    console.log(
      `Table ${this.projectId}.${datasetId}.${tableId} created successfully from ${csvFilePath}`
    );
  }
}
