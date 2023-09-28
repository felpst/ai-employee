import { Schema } from 'mongoose';
import { ICompany } from './company.interface';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export interface IChat extends DefaultModel {
  name: string;
  summary: string;
  company: Schema.Types.ObjectId | ICompany;
  workspace: Schema.Types.ObjectId | IWorkspace;
}
