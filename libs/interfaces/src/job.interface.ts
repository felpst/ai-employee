import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee';
import { DefaultModel } from './default.model';

export interface ICronJob {
  name?: string;
  description?: string;
  schedule?: string;
  timeZone?: string;
  httpTarget?: {
    httpMethod: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    uri: string;
    body?: string;
  };
}
export interface IJob extends DefaultModel {
  _id?: string;
  name: string;
  instructions: string;
  frequency: string;
  cron?: ICronJob;
  status: 'running' | 'stopped';
  aiEmployee: Schema.Types.ObjectId | IAIEmployee;
}
