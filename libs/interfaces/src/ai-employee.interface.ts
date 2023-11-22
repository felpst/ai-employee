/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export interface IAIEmployee extends DefaultModel {
  name: string;
  role: string;
  avatar?: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
  tools: { type: string, options: any }[];
}
