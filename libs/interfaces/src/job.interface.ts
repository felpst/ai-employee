import { Schema } from 'mongoose';
import { IAIEmployee } from './ai-employee';
import { DefaultModel } from './default.model';
import { IUser } from './user.interface';

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

export interface IJobContext {
  user: Partial<IUser>;
}

export interface IJob extends DefaultModel {
  _id?: string;
  name: string;
  instructions: string;
  context?: IJobContext;
  scheduler?: IJobScheduler;
  status: 'running' | 'stopped';
  aiEmployee: Schema.Types.ObjectId | IAIEmployee;
}
