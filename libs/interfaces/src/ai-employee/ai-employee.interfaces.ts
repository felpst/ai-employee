import { Schema } from 'mongoose';
import { DefaultModel } from '../default.model';
import { IToolSettings } from '../tool.interface';
import { IWebBrowser } from '../tools/web-browser.interfaces';
import { IWorkspace } from '../workspace.interface';
import { IAIEmployeeCall, IAIEmployeeCallData } from './call.interfaces';
import { IAIEmployeeMemory, IMemoryInstructionResult, IMemorySearchResult } from './memory.interfaces';

export interface IAIEmployee extends DefaultModel {
  name: string;
  role: string;
  avatar?: string;
  workspace: Schema.Types.ObjectId | IWorkspace;
  tools: IToolSettings[];
  memory: IAIEmployeeMemory[];
  resources: {
    browser: IWebBrowser;
  }

  call(data: IAIEmployeeCallData): Promise<IAIEmployeeCall>;
  memorySearch(question: string, context?: string[]): Promise<IMemorySearchResult>
  memoryInstruction(instruction: string, context?: string[]): Promise<IMemoryInstructionResult>
  checkValidAnswer(input: string, answer: string, context?: string[]): Promise<boolean>
  getEmail(): string
}
