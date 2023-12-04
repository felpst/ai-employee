/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose';
import { DefaultModel } from '../default.model';
import { IToolSettings } from '../tool.interface';
import { IWorkspace } from '../workspace.interface';
import { IAgentCall } from './agent.interface';
import { IMemoryInstructionResult, IMemorySearchResult } from './memory.interfaces';

export interface IAIEmployee extends DefaultModel {
  name: string;
  role: string;
  avatar?: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
  tools: IToolSettings[];
  memory: IAIEmployeeMemory[];

  call(input: string): Promise<IAgentCall>;
  memorySearch(question: string, context?: string[]): Promise<IMemorySearchResult>
  memoryInstruction(instruction: string, context?: string[]): Promise<IMemoryInstructionResult>
  checkValidAnswer(input: string, answer: string, context?: string[]): Promise<boolean>
}

export interface IAIEmployeeMemory {
  pageContent: string;
  metadata?: { [key: string]: any }
}
