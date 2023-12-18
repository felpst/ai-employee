import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee';
import { DefaultModel } from './default.model';

export interface IJobScheduler {
  name?: string;
  description?: string;
  schedule?: string;
  timeZone?: string;
  runOnce?: boolean;
  frequency?: string;
  startAt?: Date;
  endAt?: Date;
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
  context?: any;
  scheduler?: IJobScheduler;
  status: 'running' | 'stopped';
  aiEmployee: Schema.Types.ObjectId | IAIEmployee;
}
