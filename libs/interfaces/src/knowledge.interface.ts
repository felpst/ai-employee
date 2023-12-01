import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee.interfaces';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export interface IKnowledge extends DefaultModel {
  title: string;
  description: string;
  data: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
  employees: Schema.Types.ObjectId[] | IAIEmployee[];
  permissions: Array<{
    userId: string;
    permission: 'Reader' | 'Editor';
  }>;
  openaiFileId: string;
}
