import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee.interface';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export interface IKnowledge extends DefaultModel {
  data: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
  employees: Schema.Types.ObjectId[] | IAIEmployee[];
}
