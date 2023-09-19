import { Schema } from 'mongoose';
import { ICompany } from './company.interface';
import { DefaultModel } from './default.model';

export interface IKnowledge extends DefaultModel {
  data: string;
  company: Schema.Types.ObjectId | ICompany;
}
