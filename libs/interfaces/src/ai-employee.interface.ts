import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export interface IAIEmployee extends DefaultModel {
  name: string;
  role: string;
  avatar?: string;
  workspaces: Schema.Types.ObjectId[] | IWorkspace[];
}
