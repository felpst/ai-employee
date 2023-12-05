import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee.interface';
import { DefaultModel } from './default.model';

export interface IJob extends DefaultModel {
  _id?: string;
  name: string;
  instructions: string;
  frequency: string;
  cron: string; /** Utilizar o LLM para converter o texto de frequencia do usuário para período CRON */
  status: 'running' | 'done';
  employee: Schema.Types.ObjectId | IAIEmployee;
}
