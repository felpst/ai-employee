import { Schema } from 'mongoose';
import { ICompany } from './company.interface';
import { DefaultModel } from './default.model';

export interface IChat extends DefaultModel {
  name: string;
  summary: string;
  company: Schema.Types.ObjectId | ICompany;
}
