import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee.interface';
import { DefaultModel } from './default.model';
import { IWorkspace } from './workspace.interface';

export enum KnowledgeTypeEnum {
  Document = 'doc',
  File = 'file',
  Html = 'html',
}

export interface IKnowledge extends DefaultModel {
  _id?: string;
  title: string;
  description: string;
  type: KnowledgeTypeEnum,
  data?: string;
  contentUrl?: string;
  openaiFileId: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
  employees: Schema.Types.ObjectId[] | IAIEmployee[];
  permissions: Array<{
    userId: string;
    permission: 'Reader' | 'Editor';
  }>;
}
