import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';

export interface IDataSource extends DefaultModel {
  name: string;
  summary?: string;
  type: 'file' | 'url' | 'api' | 'db' | 'folder';
  parent?: Schema.Types.ObjectId | IDataSource;
  metadata?: any;
}
