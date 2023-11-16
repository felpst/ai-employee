import { DataConnection } from '@cognum/data-connection';
import { IDataSource } from '@cognum/interfaces';
import { DataSource } from '@cognum/models';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';
import { Request, Response } from 'express';
import fs from 'fs';
import ModelController from '../../controllers/model.controller';
import { BigQueryHelper } from '../../helpers/big-query.helper';
import { Unstructured } from '../../helpers/unstructured.helper';

let gc: Storage
if (process.env.PROD === 'true') {
  gc = new Storage({
    projectId: 'cognum',
  });
} else {
  gc = new Storage({
    keyFilename: 'cognum.secrets.json',
    projectId: 'cognum',
  });
}

const googleStorageBucket = gc.bucket('cognum-data-sources');

export class DataSourcesController extends ModelController<typeof DataSource> {
  constructor() {
    super(DataSource);
  }

  upload(req: Request, res: Response) {
    const filePath = req.file.path;

    const hash = crypto
      .createHash('sha256')
      .update(req.file.originalname + Date.now())
      .digest('hex');
    const newName = `${hash}_${req.file.originalname}`;

    const destinationPath = `${newName}`;

    googleStorageBucket
      .upload(filePath, {
        destination: destinationPath,
      })
      .then(async () => {
        const dataSource: Partial<IDataSource> = {
          name: req.file.originalname,
          type: 'file',
          metadata: {
            bucket: googleStorageBucket.name,
            path: destinationPath,
            publicUrl: `https://storage.googleapis.com/${googleStorageBucket.name}/${destinationPath}`,
            mimeType: req.file.mimetype,
            originalName: req.file.originalname,
            filePath,
          },
          createdBy: (req as any).userId,
          updatedBy: (req as any).userId,
        };
        const doc = await DataSource.create(dataSource);

        // TODO ETL process (files, urls, apis, dbs): bigquery, vector storage, etc.
        if (req.file.mimetype === 'text/csv') {
          const bigQueryHelper = new BigQueryHelper('quaq-plataform');

          bigQueryHelper.fromCSV({
            csvFilePath: filePath,
            datasetId: 'vendas',
            tableId: 'clientes',
          });
        }

        if (req.file.mimetype === 'application/pdf') {
          const dataConnection = new DataConnection();
          await dataConnection.ETL(doc);
        }

        // TODO update data source ETL metadata

        // TODO create data source summary

        // delete file from local storage
        fs.unlinkSync(filePath);

        // return created document
        res.status(200).send(doc);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }

  async teste(req: Request, res: Response) {
    const unstructured = new Unstructured();
    await unstructured.loader();
    res.send(200);
  }
}

export default new DataSourcesController();
