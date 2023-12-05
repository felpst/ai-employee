import { ObjectId } from "mongoose";
import { Observable } from "rxjs";
import { DefaultModel } from "../default.model";
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
  aiEmployee: string | ObjectId | IAIEmployee;

  run(): Observable<IAIEmployeeCall>;
}

export interface IAIEmployeeCallStep {
  type: IAIEmployeeCallStepType;
  input: any;
  output: any;
  tokenUsage: number;
  status: 'not_started' | 'running' | 'done';
  startAt: Date;
  endAt: Date;
}


export interface IAIEmployeeCallData {
  input: string;
  user: string | ObjectId | IUser;
  // TODO context
}
