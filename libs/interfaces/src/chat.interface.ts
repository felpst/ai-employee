import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee.interfaces';
import { DefaultModel } from './default.model';

export interface IChat extends DefaultModel {
  name: string;
  summary: string;
  aiEmployee: Schema.Types.ObjectId | IAIEmployee;
}
