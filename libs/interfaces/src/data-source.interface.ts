import { Schema } from 'mongoose';
import { ICompany } from './company.interface';
import { DefaultModel } from './default.model';

export interface IDataSource extends DefaultModel {
  name: string;
  summary?: string;
  type: 'file' | 'url' | 'api' | 'db' | 'folder';
  company: Schema.Types.ObjectId | ICompany;
  parent?: Schema.Types.ObjectId | IDataSource;
  metadata?: any;
}
