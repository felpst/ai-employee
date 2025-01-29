import { ObjectId } from "mongoose";
import { Observable } from "rxjs";
import { IChatMessage, IChatRoom } from "../chats";
import { DefaultModel } from "../default.model";
import { IJob } from "../job.interface";
import { IUser } from "../user.interface";
import { IAIEmployee } from "./ai-employee.interfaces";

export type IAIEmployeeCallStepType = 'intent-classification' | 'action' | 'final-answer';

export interface IAIEmployeeCall extends DefaultModel {
  input: string;
  output: string;
  steps: IAIEmployeeCallStep[];
  totalTokenUsage: number;
  status: 'not_started' | 'running' | 'done';
  startAt: Date;
  endAt: Date;
  context: IAIEmployeeCallDataContext;
  aiEmployee: string | ObjectId | IAIEmployee;

  run(): Observable<IAIEmployeeCall>;
}

export interface IAIEmployeeCallStep {
  type: IAIEmployeeCallStepType;
  description: string;
  inputs: any;
  outputs: any;
  tokenUsage: number;
  status: 'not_started' | 'running' | 'done';
  startAt: Date;
  endAt: Date;
}

export interface IAIEmployeeCallDataContext {
  user?: Partial<IUser>;
  job?: Partial<IJob>;
  chatRoom?: Partial<IChatRoom>
  chatMessages?: Partial<IChatMessage>[];
  dateNow?: string;
  chatChannel?: 'chat' | 'email' | 'sms' | 'whatsapp' | 'scheduled_task';
}

export interface IAIEmployeeCallData {
  input: string;
  user: Partial<IUser>;
  context?: IAIEmployeeCallDataContext;
}
