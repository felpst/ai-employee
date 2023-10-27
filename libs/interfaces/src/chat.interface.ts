import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export interface IChat extends DefaultModel {
  name: string;
  summary: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
}
