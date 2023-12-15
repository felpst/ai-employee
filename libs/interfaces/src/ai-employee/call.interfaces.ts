import { ObjectId } from "mongoose";
import { Observable } from "rxjs";
import { DefaultModel } from "../default.model";
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
  context: any;
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


export interface IAIEmployeeCallData {
  input: string;
  user: string | ObjectId;
  context?: any;
}
